'use client'

export default function ApiAuth() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Authentication</h1>
      <p className="text-white/60 mb-8">
        ProStep2Market uses API keys and JWT bearer tokens for authentication. All requests must include credentials in the <code className="text-[#fcd535] bg-white/5 px-1.5 py-0.5 rounded text-sm">Authorization</code> header.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">API Keys</h2>
      <p className="text-white/60 mb-4">
        API keys are the simplest way to authenticate. Generate a key from your Account &gt; Developer Settings page. Each key has a name, permission scope (read, write, admin), and an expiration date. Keep your key secret — never expose it in client-side code or public repositories.
      </p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-white/80">curl -H &quot;Authorization: Bearer sk_live_4f9a2b8c3d1e0f7&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;https://api.prostep2market.com/v1/trades</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">JWT Tokens</h2>
      <p className="text-white/60 mb-4">
        JWT tokens are used for server-to-server authentication and for users logged in via OAuth. Tokens expire after 24 hours and must be refreshed using your refresh token. The JWT payload includes the user ID, role, and token expiration.
      </p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8">
        <p className="text-green-400">// Decoded JWT payload</p>
        <p className="text-white/80">{'{'}</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;sub&quot;: &quot;usr_abc123&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;role&quot;: &quot;admin&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;iat&quot;: 1623456789,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;exp&quot;: 1623543189</p>
        <p className="text-white/80">{'}'}</p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Getting Credentials</h2>
      <p className="text-white/60 mb-4">
        To get your API credentials:
      </p>
      <ol className="list-decimal list-inside text-white/60 space-y-2 mb-8">
        <li>Log in to your ProStep2Market account.</li>
        <li>Navigate to <strong className="text-white">Settings &gt; Developer</strong>.</li>
        <li>Click <strong className="text-white">Generate API Key</strong>.</li>
        <li>Give your key a descriptive name (e.g. &quot;Production Trading Bot&quot;).</li>
        <li>Select the permission scopes your integration needs.</li>
        <li>Copy the key and store it securely — you won't be able to see it again.</li>
      </ol>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Making Authenticated Requests</h2>
      <p className="text-white/60 mb-4">Include the token in the <code className="text-[#fcd535] bg-white/5 px-1.5 py-0.5 rounded text-sm">Authorization</code> header as a Bearer token:</p>

      <p className="text-white font-medium mb-2">cURL</p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-4">
        <p className="text-white/80">curl -H &quot;Authorization: Bearer YOUR_TOKEN&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;-H &quot;Content-Type: application/json&quot; \</p>
        <p className="text-white/80">&nbsp;&nbsp;https://api.prostep2market.com/v1/trades</p>
      </div>

      <p className="text-white font-medium mb-2">JavaScript (Fetch)</p>
      <pre className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-4 text-white/80 overflow-x-auto">
{`const response = await fetch('https://api.prostep2market.com/v1/trades', {
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json',
  },
})
const data = await response.json()`}
      </pre>

      <p className="text-white font-medium mb-2">Python (requests)</p>
      <pre className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm mb-8 text-white/80 overflow-x-auto">
{`import requests

headers = {
  "Authorization": f"Bearer {token}",
  "Content-Type": "application/json",
}
response = requests.get("https://api.prostep2market.com/v1/trades", headers=headers)
data = response.json()`}
      </pre>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Error Handling</h2>
      <p className="text-white/60 mb-4">
        Authentication errors return <strong className="text-white">401 Unauthorized</strong> with a descriptive message. Common issues include expired tokens, invalid API keys, and insufficient permissions. Rotate compromised keys immediately from the Developer Settings page.
      </p>
      <div className="rounded-lg bg-[#1a1d24] p-4 font-mono text-sm">
        <p className="text-white/80">{'{'}</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;error&quot;: &quot;unauthorized&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;message&quot;: &quot;API key is invalid or expired.&quot;,</p>
        <p className="text-white/80">&nbsp;&nbsp;&quot;code&quot;: 401</p>
        <p className="text-white/80">{'}'}</p>
      </div>
    </div>
  )
}
