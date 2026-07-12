'use client'

import { AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const ISSUES = [
  {
    title: 'MT5 Connection Failed',
    cause: 'Your MT5 terminal may be offline, the server address may be incorrect, or your login credentials are invalid. Firewall or VPN settings can also block the connection.',
    solution:
      'Verify that MT5 is running and connected to your broker. Check your server address and login credentials in Settings &rarr; Platform Connection. Temporarily disable any VPN or firewall and try reconnecting. If the issue persists, restart both MT5 and ProStep2Market.',
  },
  {
    title: 'Trades Not Syncing',
    cause: 'Auto-sync may be disabled in your settings, or the trades were executed while the connection was interrupted. Large trade volumes can also delay syncing.',
    solution:
      'Go to Settings &rarr; Platform Connection and click Sync Now. Ensure auto-sync is enabled. If trades still do not appear, use the Manual Import option to upload trades from your MT5 history report.',
  },
  {
    title: 'Edge Score Not Updating',
    cause: 'The Edge Score recalculates after each new trade is logged or synced. If no new trades have been added, or if journal entries are incomplete, the score may remain static.',
    solution:
      'Log or import at least one new trade to trigger a recalculation. Ensure all required journal fields are filled — missed ratings or missing strategy tags can freeze the score. Refresh the page after adding data.',
  },
  {
    title: 'Login Issues',
    cause: 'Incorrect email or password, an expired session, or browser cache conflicts can prevent login. Two-factor authentication errors may also block access.',
    solution:
      'Click Forgot Password to reset your credentials. Clear your browser cache and cookies, then try logging in again. If 2FA is enabled, ensure you are entering the code from your authenticator app within the valid window.',
  },
  {
    title: 'Data Not Loading',
    cause: 'Slow internet connection, browser extensions interfering with the page, or a temporary server outage can cause data loading failures.',
    solution:
      'Refresh the page and check your internet connection. Disable browser extensions like ad-blockers temporarily. If the issue continues, check our Status Page for any ongoing incidents.',
  },
  {
    title: 'Email Not Received',
    cause: 'The email may be in your spam folder, your email address may have a typo, or the mail server may be delayed. Some email providers block automated emails.',
    solution:
      'Check your spam and promotions folders. Add noreply@prostep2market.com to your contacts. If you still do not receive the email, update your email address in Settings and request a resend.',
  },
]

export default function Troubleshooting() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-2">
        <AlertTriangle className="h-6 w-6 text-[#fcd535]" />
        <h1 className="text-3xl font-bold text-white">Troubleshooting Guide</h1>
      </div>
      <p className="text-white/60 mb-10 max-w-2xl">
        Find solutions to common issues you may encounter while using ProStep2Market. Click on a
        topic to expand the details.
      </p>

      <div className="space-y-3">
        {ISSUES.map((issue, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={issue.title}
              className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between p-5 text-left hover:bg-white/[0.03] transition-colors"
              >
                <h2 className="text-lg font-semibold text-white">{issue.title}</h2>
                {isOpen ? (
                  <ChevronDown className="h-5 w-5 text-white/60 shrink-0" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-white/60 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white/80 mb-1">Cause</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{issue.cause}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white/80 mb-1">Solution</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{issue.solution}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white mb-2">Still need help?</h2>
        <p className="text-sm text-white/60">
          If you cannot find a solution here, reach out to our support team at{' '}
          <span className="text-[#fcd535]">support@prostep2market.com</span> or use the in-app chat
          widget. We typically respond within 2 hours during business hours.
        </p>
      </div>
    </div>
  )
}
