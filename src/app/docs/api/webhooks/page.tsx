'use client'

const EVENTS = [
  { event: 'trade.created', description: 'A new trade has been recorded.' },
  { event: 'trade.updated', description: 'An existing trade has been modified.' },
  { event: 'trade.closed', description: 'A trade has been closed with an exit price.' },
  { event: 'analytics.updated', description: 'New analytics data is available for a user.' },
  { event: 'user.updated', description: 'User profile or settings have changed.' },
  { event: 'webhook.test', description: 'Test event sent during webhook configuration.' },
]

export default function WebhooksPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Webhooks</h1>
      <p className="text-white/60 mb-8">
        Webhooks allow your application to receive real-time notifications when events happen in ProStep2Market. Subscribe to the events that matter to you and we'll send HTTP POST requests to your endpoint.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Overview</h2>
      <p className="text-white/60 mb-4">
        When an event occurs, ProStep2Market sends an HTTP POST request to your registered webhook URL with a JSON payload describing the event. Your server must respond with a <strong className="text-white">200 OK</strong> within 5 seconds to acknowledge receipt.
      </p>
      <p className="text-white/60 mb-8">
        Webhooks are configured per API key. You can register up to 10 webhook endpoints per key.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Events</h2>
      <p className="text-white/60 mb-4">Subscribe to any combination of the following events:</p>
      <div className="space-y-3 mb-8">
        {EVENTS.map((e) => (
          <div key={e.event} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <span className="text-xs font-bold px-2 py-1 rounded bg-purple-500/20 text-purple-400">EVENT</span>
            <span className="text-[#fcd535] font-mono text-sm">{e.event}</span>
            <span className="text-white/60 text-sm ml-auto">{e.description}</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Payload Format</h2>
      <p className="text-white/60 mb-4">Every webhook POST includes the following JSON structure:</p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-white/80">{'{'}</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;id&quot;: &quot;wh_evt_abc123&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;event&quot;: &quot;trade.created&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;created_at&quot;: &quot;2026-07-11T12:00:00Z&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;data&quot;: {'{'} ... &quot;resource&quot;: &quot;trade.xyz789&quot; {'}'}</p>
        <p className="text-white/80">{'}'}</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Security</h2>
      <p className="text-white/60 mb-4">
        Each webhook request includes a signature in the <code className="text-[#fcd535] bg-white/5 px-1.5 py-0.5 rounded text-sm">X-Webhook-Signature</code> header. Verify the signature using your webhook secret to ensure the request is authentic.
      </p>

      <p className="text-white font-medium mb-2">Signature Verification (Node.js)</p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-white/80">const crypto = require('crypto')</p>
        <p className="text-white/80">&nbsp;</p>
        <p className="text-white/80">const secret = 'whsec_your_secret_key'</p>
        <p className="text-white/80">const sig = req.headers['x-webhook-signature']</p>
        <p className="text-white/80">const payload = JSON.stringify(req.body)</p>
        <p className="text-white/80">const expected = crypto</p>
        <p className="text-white/80">&nbsp;&nbsp;.createHmac('sha256', secret)</p>
        <p className="text-white/80">&nbsp;&nbsp;.update(payload)</p>
        <p className="text-white/80">&nbsp;&nbsp;.digest('hex')</p>
        <p className="text-white/80">&nbsp;</p>
        <p className="text-white/80">if (sig !== expected) throw new Error('Invalid signature')</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Retry Policy</h2>
      <p className="text-white/60 mb-4">
        If your endpoint does not respond with 200 OK within 5 seconds, we will retry up to 5 times with exponential backoff (10s, 30s, 2min, 10min, 1h). After all retries are exhausted, the event is marked as failed and logged. You can manually replay failed webhooks from the Developer Settings page.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Managing Webhooks</h2>
      <p className="text-white/60 mb-4">
        Register, update, and delete webhooks from Settings &gt; Developer &gt; Webhooks. Each endpoint requires a URL, a list of subscribed events, and a description. Test your endpoint with the test event before subscribing to production events.
      </p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm">
        <p className="text-white/80">curl -X POST https://api.prostep2market.com/v1/webhooks \</p>
        <p className="text-white/80">&nbsp;&nbsp;-H &quot;Authorization: Bearer YOUR_TOKEN&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;-H &quot;Content-Type: application/json&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;-d '{'{'}&quot;url&quot;: &quot;https://myapp.com/webhooks/prostep&quot;, &quot;events&quot;: [&quot;trade.created&quot;, &quot;trade.closed&quot;], &quot;description&quot;: &quot;Sync trades to my app&quot;{'}'}'</p>
      </div>
    </div>
  )
}
