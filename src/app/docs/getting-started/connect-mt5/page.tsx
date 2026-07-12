'use client'

export default function ConnectMT5() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-[#eaecef]">Connect Your MT5 Account</h1>
        <p className="text-[#aeaeae] max-w-2xl">
          Link your MetaTrader 5 (MT5) trading account to ProStep2Market to automatically import trades,
          sync balances, and track your performance in real time.
        </p>
      </div>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 text-sm text-[#eaecef]">
        <strong>Prerequisites:</strong> MT5 desktop or mobile app installed, a live or demo trading account, and
        your broker server name. API access must be enabled in MT5.
      </div>

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">1. Install MetaTrader 5</h2>
          <p className="text-[#aeaeae]">
            Download and install MT5 from your broker website or the official MetaQuotes site. Log in with your
            trading account credentials.
          </p>
          <div className="bg-[#1e2329] border border-[#2b3139] rounded-lg p-4 font-mono text-sm text-[#aeaeae]">
            <div>https://www.metatrader5.com/en/download</div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">2. Enable API Access</h2>
          <p className="text-[#aeaeae]">
            In MT5, go to <strong>Tools → Options → Expert Advisors</strong> and check{' '}
            <strong>Allow automated trading</strong>. Also enable{' '}
            <strong>Allow DLL imports</strong> if required by your broker. Click OK to save.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">3. Get Your Credentials</h2>
          <p className="text-[#aeaeae]">
            Open MT5 and note your account number, investor (read-only) password, and broker server name. You
            can find these under <strong>File → Account → Account Details</strong>.
          </p>
          <div className="bg-[#1e2329] border border-[#2b3139] rounded-lg p-4 font-mono text-sm text-[#aeaeae]">
            <div>Account: 12345678</div>
            <div>Server: BrokerName-Server</div>
            <div>Password: •••••••••••</div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">4. Connect in ProStep2Market</h2>
          <p className="text-[#aeaeae]">
            Go to <strong>Settings → Broker Connections</strong> in ProStep2Market. Select MT5 and enter your
            account number, server, and investor password. Click <strong>Connect</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">5. Verify Sync</h2>
          <p className="text-[#aeaeae]">
            Once connected, you should see your account balance, open positions, and recent trade history appear
            in the Dashboard. If nothing appears within 60 seconds, check the troubleshooting tips below.
          </p>
        </section>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-[#eaecef]">Troubleshooting</h2>
        <ul className="space-y-2 text-sm text-[#aeaeae] list-disc pl-5">
          <li><strong>Invalid credentials:</strong> Double-check your server name and investor password. Use the exact spelling your broker provides.</li>
          <li><strong>Firewall blocking:</strong> Ensure your firewall or anti-virus is not blocking MT5 API ports. Temporarily disable it to test.</li>
          <li><strong>Broker restrictions:</strong> Some brokers disable API access on demo accounts. Try a live account or contact broker support.</li>
          <li><strong>Sync delay:</strong> Trades may take up to 2 minutes to appear. Use the Refresh button on the Dashboard.</li>
        </ul>
      </div>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 text-sm text-[#eaecef]">
        <strong>Need help?</strong> Contact support at support@prostep2market.com or visit the Troubleshooting
        page in Tutorials.
      </div>
    </div>
  )
}
