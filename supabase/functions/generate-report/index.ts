import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { html, userId } = await req.json();

    // Use API2PDF for PDF generation (recommended in research)
    const apiKey = Deno.env.get('API2PDF_API_KEY');

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'API2PDF_API_KEY not configured',
          message: 'PDF generation requires API2PDF service. Configure the API key to enable PDF export.',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const response = await fetch('https://api.api2pdf.com/wkhtmltopdf/html', {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html,
        options: {
          orientation: 'portrait',
          pageSize: 'a4',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API2PDF error: ${response.statusText}`);
    }

    const result = await response.json();

    // Upload to Supabase Storage
    const supabase = createClient(
      Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const fileName = `reports/${userId}/analysis-${Date.now()}.pdf`;

    // Convert base64 to Uint8Array
    const binaryString = atob(result.file);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const { data, error } = await supabase.storage
      .from('reports')
      .upload(fileName, bytes, { contentType: 'application/pdf' });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('reports')
      .getPublicUrl(fileName);

    return new Response(
      JSON.stringify({ url: urlData.publicUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
