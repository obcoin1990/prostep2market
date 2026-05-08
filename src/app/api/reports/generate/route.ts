import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';

const reportSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  includeSections: z
    .array(
      z.enum(['summary', 'quality', 'patterns', 'risk', 'recommendations'])
    )
    .optional(),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = reportSchema.parse(body);
    const { startDate, endDate, includeSections } = parsed;

    // Fetch analysis data
    const analysisData = await fetchAnalysisData(user.id, startDate, endDate);

    // Generate HTML report
    const html = generateReportHTML(analysisData, parsed.includeSections);

    // For now, return HTML (actual PDF generation requires API2PDF or similar)
    return NextResponse.json({
      reportHtml: html,
      message: 'Report generated (PDF conversion requires API service)',
    });
  } catch (error) {
    console.error('Report generation error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

async function fetchAnalysisData(userId: string, startDate: string, endDate: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('daily_analytics')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date');

  return data || [];
}

function generateReportHTML(data: any[], includeSections?: string[]) {
  const sections = includeSections || [
    'summary',
    'quality',
    'patterns',
    'risk',
    'recommendations',
  ];

  // Calculate summary stats
  const totalTrades = data.reduce((sum, d) => sum + (d.total_trades || 0), 0);
  const totalPnL = data.reduce((sum, d) => sum + (d.total_pnl || 0), 0);
  const avgWinRate =
    data.length > 0
      ? data.reduce((sum, d) => sum + (d.win_rate || 0), 0) / data.length
      : 0;
  const maxDrawdown = Math.max(
    ...data.map((d) => d.max_drawdown || 0),
    0
  );

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Trading Analysis Report</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #1a1a1a; border-bottom: 2px solid #E53935; }
    h2 { color: #333; margin-top: 30px; }
    .metric { display: inline-block; margin: 10px 20px 10px 0; }
    .metric-value { font-size: 24px; font-weight: bold; color: #E53935; }
    .metric-label { font-size: 12px; color: #666; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f5f5f5; }
    .positive { color: #2E7D32; }
    .negative { color: #E53935; }
    .section { margin-bottom: 40px; }
  </style>
</head>
<body>
  <h1>📊 AI Trading Analysis Report</h1>
  <p>Generated: ${new Date().toLocaleDateString()}</p>

  ${
    sections.includes('summary')
      ? `
  <div class="section">
    <h2>Executive Summary</h2>
    <div class="metric">
      <div class="metric-value">${totalTrades}</div>
      <div class="metric-label">Total Trades</div>
    </div>
    <div class="metric">
      <div class="metric-value ${totalPnL >= 0 ? 'positive' : 'negative'}">$${totalPnL.toFixed(2)}</div>
      <div class="metric-label">Total P&L</div>
    </div>
    <div class="metric">
      <div class="metric-value">${avgWinRate.toFixed(1)}%</div>
      <div class="metric-label">Avg Win Rate</div>
    </div>
    <div class="metric">
      <div class="metric-value negative">${maxDrawdown.toFixed(1)}%</div>
      <div class="metric-label">Max Drawdown</div>
    </div>
  </div>
  `
      : ''
  }

  ${
    sections.includes('risk')
      ? `
  <div class="section">
    <h2>Risk Metrics</h2>
    <table>
      <tr>
        <th>Metric</th>
        <th>Value</th>
        <th>Status</th>
      </tr>
      <tr>
        <td>Max Drawdown</td>
        <td>${maxDrawdown.toFixed(2)}%</td>
        <td>${maxDrawdown > 20 ? '⚠️ High' : '✅ Normal'}</td>
      </tr>
      <tr>
        <td>Lot Size Variance</td>
        <td>${data[0]?.lot_size_variance?.toFixed(1) || 0}%</td>
        <td>${(data[0]?.lot_size_variance || 0) > 30 ? '⚠️ High' : '✅ Normal'}</td>
      </tr>
    </table>
  </div>
  `
      : ''
  }

  ${
    sections.includes('recommendations')
      ? `
  <div class="section">
    <h2>Recommendations</h2>
    <ul>
      <li>Maintain consistent position sizing across all trades</li>
      <li>Implement a cooling-off period after consecutive losses</li>
      <li>Focus on improving entries during the London session</li>
    </ul>
  </div>
  `
      : ''
  }

  <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
    Generated by Prostep2market AI Analysis Engine
  </footer>
</body>
</html>
  `.trim();
}
