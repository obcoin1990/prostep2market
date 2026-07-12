'use client'

export default function AccountSetup() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-[#eaecef]">Account Setup</h1>
        <p className="text-[#aeaeae] max-w-2xl">
          Follow this guide to create your ProStep2Market account, verify your identity, and configure your
          preferences so you can start journaling your trades right away.
        </p>
      </div>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 text-sm text-[#eaecef]">
        <strong>Prerequisites:</strong> You need a valid email address and a funded broker account (optional for
        demo trading).
      </div>

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">1. Create Your Account</h2>
          <p className="text-[#aeaeae]">
            Navigate to the ProStep2Market signup page and enter your name, email address, and a strong
            password. Agree to the terms of service and click <strong>Create Account</strong>.
          </p>
          <div className="bg-[#1e2329] border border-[#2b3139] rounded-lg p-4 font-mono text-sm text-[#aeaeae]">
            <div>https://app.prostep2market.com/signup</div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">2. Verify Your Email</h2>
          <p className="text-[#aeaeae]">
            Check your inbox for a verification email from <span className="text-[#fcd535]">no-reply@prostep2market.com</span>.
            Click the link inside to confirm your email address. If you do not see it, check your spam folder.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">3. Complete Your Profile</h2>
          <p className="text-[#aeaeae]">
            Fill in your profile details — display name, time zone, preferred currency, and trading experience
            level. This helps personalize your dashboard and journaling experience.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">4. Set Preferences</h2>
          <p className="text-[#aeaeae]">
            Configure your notification preferences, risk display units (pips, points, ticks), and chart style
            defaults. You can always change these later from the Settings page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">5. Connect Your Broker</h2>
          <p className="text-[#aeaeae]">
            Link your MetaTrader 4 or 5 account to enable automatic trade import. See the{' '}
            <a href="/docs/getting-started/connect-mt5" className="text-[#fcd535] hover:underline">Connect MT5 guide</a>{' '}
            for detailed instructions. You can skip this step and enter trades manually if you prefer.
          </p>
        </section>
      </div>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 text-sm text-[#eaecef]">
        <strong>Tip:</strong> Complete all five steps to unlock automatic trade sync, personalized analytics,
        and real-time risk monitoring.
      </div>
    </div>
  )
}
