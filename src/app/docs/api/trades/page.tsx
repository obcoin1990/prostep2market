'use client'

const ENDPOINTS = [
  { method: 'GET', path: '/trades', desc: 'List all trades', color: 'text-green-400', bg: 'bg-green-500/20' },
  { method: 'POST', path: '/trades', desc: 'Create a new trade', color: 'text-[#fcd535]', bg: 'bg-[#fcd535]/20' },
  { method: 'GET', path: '/trades/:id', desc: 'Get a single trade', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { method: 'PUT', path: '/trades/:id', desc: 'Update a trade', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { method: 'DELETE', path: '/trades/:id', desc: 'Delete a trade', color: 'text-red-400', bg: 'bg-red-500/20' },
]

export default function TradesApi() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Trades API</h1>
      <p className="text-white/60 mb-8">
        The Trades API lets you create, read, update, and delete trades programmatically. All endpoints require authentication.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Endpoints</h2>
      <div className="space-y-3 mb-8">
        {ENDPOINTS.map((ep) => (
          <div key={ep.path} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <span className={`text-xs font-bold px-2 py-1 rounded ${ep.bg} ${ep.color}`}>{ep.method}</span>
            <span className="text-white font-mono text-sm">{ep.path}</span>
            <span className="text-white/60 text-sm ml-auto">{ep.desc}</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">GET /trades</h2>
      <p className="text-white/60 mb-4">Returns a paginated list of trades for the authenticated user. Supports filtering by date range, instrument, and status.</p>

      <p className="text-white font-medium mb-2">Request</p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-4">
        <p className="text-white/80">curl -H &quot;Authorization: Bearer YOUR_TOKEN&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;https://api.prostep2market.com/v1/trades?limit=20&amp;status=open</p>
      </div>

      <p className="text-white font-medium mb-2">Response</p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-white/80">{'{'}</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;data&quot;: [</p>
        <p className="text-white/80">&nbsp;&nbsp;&nbsp;&nbsp;{'{'}</p>
        <p className="text-white/80">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;id&quot;: &quot;trade_abc123&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;instrument&quot;: &quot;EURUSD&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;direction&quot;: &quot;buy&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;entry_price&quot;: 1.0850,</p>
        <p className="text-white/80">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;current_price&quot;: 1.0872,</p>
        <p className="text-white/80">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;status&quot;: &quot;open&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;created_at&quot;: &quot;2026-07-11T10:30:00Z&quot;</p>
        <p className="text-white/80">&nbsp;&nbsp;&nbsp;&nbsp;{'}'}</p>
        <p className="text-white/80">&nbsp;&nbsp;],</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;pagination&quot;: {'{'} &quot;page&quot;: 1, &quot;total&quot;: 42 {'}'}</p>
        <p className="text-white/80">{'}'}</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">POST /trades</h2>
      <p className="text-white/60 mb-4">Create a new trade record. Returns the created trade object with a unique ID.</p>

      <p className="text-white font-medium mb-2">Request</p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-4">
        <p className="text-white/80">curl -X POST https://api.prostep2market.com/v1/trades \</p>
        <p className="text-white/80">&nbsp;&nbsp;-H &quot;Authorization: Bearer YOUR_TOKEN&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;-H &quot;Content-Type: application/json&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;-d '{'{'}&quot;instrument&quot;: &quot;GBPUSD&quot;, &quot;direction&quot;: &quot;sell&quot;, &quot;entry_price&quot;: 1.2640, &quot;volume&quot;: 0.1{'}'}'</p>
      </div>

      <p className="text-white font-medium mb-2">Response</p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-white/80">{'{'}</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;id&quot;: &quot;trade_def456&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;instrument&quot;: &quot;GBPUSD&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;direction&quot;: &quot;sell&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;entry_price&quot;: 1.2640,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;volume&quot;: 0.1,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;status&quot;: &quot;open&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;created_at&quot;: &quot;2026-07-11T11:00:00Z&quot;</p>
        <p className="text-white/80">{'}'}</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">GET /trades/:id</h2>
      <p className="text-white/60 mb-4">Retrieve a single trade by its unique ID. Includes full details including P&amp;L, exit price, and journal notes.</p>

      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-white/80">curl -H &quot;Authorization: Bearer YOUR_TOKEN&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;https://api.prostep2market.com/v1/trades/trade_abc123</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">PUT /trades/:id</h2>
      <p className="text-white/60 mb-4">Update an existing trade. Send only the fields you want to change. Returns the updated trade object.</p>

      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-white/80">curl -X PUT https://api.prostep2market.com/v1/trades/trade_abc123 \</p>
        <p className="text-white/80">&nbsp;&nbsp;-H &quot;Authorization: Bearer YOUR_TOKEN&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;-H &quot;Content-Type: application/json&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;-d '{'{'}&quot;status&quot;: &quot;closed&quot;, &quot;exit_price&quot;: 1.0890{'}'}'</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">DELETE /trades/:id</h2>
      <p className="text-white/60 mb-4">Delete a trade by ID. This action is permanent and cannot be undone. Returns a confirmation message.</p>

      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-4">
        <p className="text-white/80">curl -X DELETE https://api.prostep2market.com/v1/trades/trade_abc123 \</p>
        <p className="text-white/80">&nbsp;&nbsp;-H &quot;Authorization: Bearer YOUR_TOKEN&quot;</p>
      </div>

      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm">
        <p className="text-white/80">{'{'}</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;message&quot;: &quot;Trade trade_abc123 deleted successfully.&quot;</p>
        <p className="text-white/80">{'}'}</p>
      </div>
    </div>
  )
}
