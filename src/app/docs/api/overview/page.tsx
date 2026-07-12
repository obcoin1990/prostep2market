'use client'

export default function ApiOverview() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">API Overview</h1>
      <p className="text-white/60 mb-4">
        The ProStep2Market API lets you programmatically access trades, analytics, and account data. Build custom integrations, automate reporting, and connect your trading tools.
      </p>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5 mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">Base URL</p>
        <p className="text-[#fcd535] font-mono text-lg">https://api.prostep2market.com/v1</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Authentication</h2>
      <p className="text-white/60 mb-4">
        All API requests require authentication via API key or JWT bearer token. Pass your credentials in the <code className="text-[#fcd535] bg-white/5 px-1.5 py-0.5 rounded text-sm">Authorization</code> header. See the <a href="/docs/api/auth" className="text-[#fcd535] hover:underline">Authentication</a> guide for details.
      </p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-white/80">curl -H &quot;Authorization: Bearer YOUR_TOKEN&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;https://api.prostep2market.com/v1/trades</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Rate Limits</h2>
      <p className="text-white/60 mb-4">
        API requests are rate-limited per API key. Standard tier: 100 requests/min. Pro tier: 500 requests/min. Enterprise: custom limits. Rate limit headers are returned with every response:
      </p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-4">
        <p className="text-green-400">X-RateLimit-Limit: 100</p>
        <p className="text-green-400">X-RateLimit-Remaining: 87</p>
        <p className="text-green-400">X-RateLimit-Reset: 1623456789</p>
      </div>
      <p className="text-white/60 mb-8">
        When exceeded, the API returns <strong className="text-white">429 Too Many Requests</strong>. Retry after the time specified in the <code className="text-[#fcd535] bg-white/5 px-1.5 py-0.5 rounded text-sm">Retry-After</code> header.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Endpoints</h2>
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <span className="text-xs font-bold px-2 py-1 rounded bg-green-500/20 text-green-400">GET</span>
          <span className="text-white font-mono text-sm">/trades</span>
          <span className="text-white/60 text-sm">List all trades</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <span className="text-xs font-bold px-2 py-1 rounded bg-[#fcd535]/20 text-[#fcd535]">POST</span>
          <span className="text-white font-mono text-sm">/trades</span>
          <span className="text-white/60 text-sm">Create a new trade</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-400">GET</span>
          <span className="text-white font-mono text-sm">/analytics/summary</span>
          <span className="text-white/60 text-sm">Get performance summary</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <span className="text-xs font-bold px-2 py-1 rounded bg-purple-500/20 text-purple-400">POST</span>
          <span className="text-white font-mono text-sm">/webhooks</span>
          <span className="text-white/60 text-sm">Register a webhook</span>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">SDKs</h2>
      <p className="text-white/60 mb-4">
        Official SDKs are available for JavaScript and Python. They handle authentication, rate limiting, and response parsing so you can focus on your integration.
      </p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-green-400">npm install prostep2market-api</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Errors</h2>
      <p className="text-white/60 mb-4">
        The API returns standard HTTP status codes and a JSON error body:
      </p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-4">
        <p className="text-white/80">{'{'} </p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;error&quot;: &quot;invalid_request&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;message&quot;: &quot;The request body is missing required fields.&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;code&quot;: 400</p>
        <p className="text-white/80">{'}'}</p>
      </div>
      <p className="text-white/60">
        Common codes: <strong className="text-white">400</strong> Bad Request, <strong className="text-white">401</strong> Unauthorized, <strong className="text-white">403</strong> Forbidden, <strong className="text-white">404</strong> Not Found, <strong className="text-white">429</strong> Rate Limited, <strong className="text-white">500</strong> Internal Error.
      </p>
    </div>
  )
}
