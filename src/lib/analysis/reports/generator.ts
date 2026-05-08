interface ReportOptions {
  startDate: string;
  endDate: string;
  includeSections?: string[];
}

interface ReportResult {
  success: boolean;
  reportUrl?: string;
  error?: string;
}

/**
 * Generates a PDF report by calling the API endpoint.
 */
export async function generateReport(
  options: ReportOptions
): Promise<ReportResult> {
  try {
    const response = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Failed to generate report' };
    }

    const data = await response.json();

    // For now, open the HTML in a new tab or offer download
    // In production, this would convert HTML to PDF
    if (data.reportHtml) {
      // Create a blob and download
      const blob = new Blob([data.reportHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trading-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true };
    }

    return { success: false, error: 'No report generated' };
  } catch (error) {
    console.error('Report generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
