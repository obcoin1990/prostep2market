'use client'

export default function SdksPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">SDKs & Libraries</h1>
      <p className="text-white/60 mb-8">
        Official SDKs simplify integration with the ProStep2Market API. They handle authentication, rate limiting, request retries, and response parsing automatically.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">JavaScript SDK</h2>
      <p className="text-white/60 mb-4">
        The JavaScript/TypeScript SDK works in Node.js and browser environments. It provides typed methods for every API endpoint.
      </p>

      <p className="text-white font-medium mb-2">Installation</p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-4">
        <p className="text-green-400">npm install prostep2market-api</p>
      </div>

      <p className="text-white font-medium mb-2">Usage</p>
      <pre className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8 text-white/80 overflow-x-auto">
{`import ProStep2Market from 'prostep2market-api'

const client = new ProStep2Market({
  apiKey: 'sk_live_4f9a2b8c3d',
  environment: 'production',
})

const trades = await client.trades.list({ limit: 50 })
const summary = await client.analytics.getSummary()`}
      </pre>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Python SDK</h2>
      <p className="text-white/60 mb-4">The Python SDK supports Python 3.9+ and uses requests under the hood with automatic retry and session management.</p>

      <p className="text-white font-medium mb-2">Installation</p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-4">
        <p className="text-green-400">pip install prostep2market-api</p>
      </div>

      <p className="text-white font-medium mb-2">Usage</p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-white/80">from prostep2market import Client</p>
        <p className="text-white/80">&nbsp;</p>
        <p className="text-white/80">client = Client(api_key=&quot;sk_live_4f9a2b8c3d&quot;)</p>
        <p className="text-white/80">&nbsp;</p>
        <p className="text-white/80">trades = client.trades.list(limit=50)</p>
        <p className="text-white/80">summary = client.analytics.summary(start=&quot;2026-01-01&quot;, end=&quot;2026-06-30&quot;)</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">cURL Examples</h2>
      <p className="text-white/60 mb-4">
        For quick testing and scripting, use cURL directly against the API. All examples in our documentation use cURL as the default.
      </p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-green-400"># List recent trades</p>
        <p className="text-white/80">curl -H &quot;Authorization: Bearer YOUR_TOKEN&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;https://api.prostep2market.com/v1/trades?limit=10</p>
        <p className="text-white/80">&nbsp;</p>
        <p className="text-green-400"># Get analytics summary</p>
        <p className="text-white/80">curl -H &quot;Authorization: Bearer YOUR_TOKEN&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;https://api.prostep2market.com/v1/analytics/summary</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">SDK Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Automatic Retry</h3>
          <p className="text-white/60 text-sm">Retries failed requests with exponential backoff for rate limits and server errors.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Type Safety</h3>
          <p className="text-white/60 text-sm">Full TypeScript definitions for all request and response types.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Pagination Helpers</h3>
          <p className="text-white/60 text-sm">Automatic pagination for list endpoints — iterate over all results with a single method call.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Error Handling</h3>
          <p className="text-white/60 text-sm">Consistent error types with descriptive messages and error codes.</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Migration Guide</h2>
      <p className="text-white/60 mb-4">
        Upgrading from v1 to v2? The SDK now uses environment-based configuration instead of per-request headers. See the <a href="/docs/api/changelog" className="text-[#fcd535] hover:underline">Changelog</a> for breaking changes. Key migration steps:
      </p>
      <ol className="list-decimal list-inside text-white/60 space-y-2">
        <li>Replace <code className="text-[#fcd535] bg-white/5 px-1.5 py-0.5 rounded text-sm">new Client({'{'}token{'}'})</code> with <code className="text-[#fcd535] bg-white/5 px-1.5 py-0.5 rounded text-sm">new Client({'{'}apiKey{'}'})</code>.</li>
        <li>Update import paths to the new package name (<code className="text-[#fcd535] bg-white/5 px-1.5 py-0.5 rounded text-sm">prostep2market-api</code>).</li>
        <li>Replace <code className="text-[#fcd535] bg-white/5 px-1.5 py-0.5 rounded text-sm">.getTrades()</code> with <code className="text-[#fcd535] bg-white/5 px-1.5 py-0.5 rounded text-sm">.trades.list()</code>.</li>
      </ol>
    </div>
  )
}
