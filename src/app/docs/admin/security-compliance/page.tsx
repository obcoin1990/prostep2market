'use client'

const FEATURES = [
  {
    name: 'Multi-Factor Authentication',
    status: 'Active',
    description: 'Require MFA for all admin accounts. Supports TOTP, SMS, and hardware security keys (WebAuthn).',
  },
  {
    name: 'Session Management',
    status: 'Active',
    description: 'Configure session timeouts, concurrent session limits, and force logout all sessions globally.',
  },
  {
    name: 'IP Allowlist',
    status: 'Enabled',
    description: 'Restrict admin dashboard access to specific IP addresses or CIDR ranges. Blocks all other traffic.',
  },
  {
    name: 'Password Policy',
    status: 'Strict',
    description: 'Enforce minimum length, complexity requirements, and password rotation every 90 days.',
  },
]

const FRAMEWORKS = [
  { name: 'SOC 2', description: 'Data security, availability, and confidentiality controls audited annually.' },
  { name: 'GDPR', description: 'Data subject rights, consent management, and breach notification procedures in place.' },
  { name: 'CCPA', description: 'California Consumer Privacy Act compliance for US-based users.' },
]

export default function SecurityCompliance() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Security & Compliance</h1>
      <p className="text-white/60 mb-8">
        Protect your platform and user data with enterprise-grade security controls. Monitor access, configure policies, and stay compliant with industry frameworks.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Security Center</h2>
      <p className="text-white/60 mb-4">
        The Security Center gives you control over authentication, access policies, and threat monitoring. Configure the following features:
      </p>

      <div className="space-y-4 mb-8">
        {FEATURES.map((f) => (
          <div key={f.name} className="rounded-xl border border-white/10 bg-white/5 p-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-white font-medium mb-1">{f.name}</h3>
              <p className="text-white/60 text-sm">{f.description}</p>
            </div>
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400">
              {f.status}
            </span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Audit Logs</h2>
      <p className="text-white/60 mb-4">
        Every administrative action is recorded in the Audit Log. Entries include timestamp, admin user, action type, target resource, IP address, and outcome (success/failure). Logs are immutable and retained for 12 months.
      </p>
      <p className="text-white/60 mb-4">
        Use the search and filter tools to investigate specific events. Export logs as CSV or JSON for external SIEM integration. Set up alert rules to notify your security team of high-risk actions like role changes or failed login attempts.
      </p>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 rounded mb-8">
        <p className="text-white/80 text-sm">
          <strong className="text-[#fcd535]">Best Practice:</strong> Review audit logs weekly. Configure alerts for role promotions, MFA changes, and bulk user operations.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Compliance Frameworks</h2>
      <p className="text-white/60 mb-4">
        ProStep2Market is built to support the following compliance standards:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {FRAMEWORKS.map((fw) => (
          <div key={fw.name} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-white font-medium mb-1 text-[#fcd535]">{fw.name}</h3>
            <p className="text-white/60 text-sm">{fw.description}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Best Practices</h2>
      <ul className="list-disc list-inside text-white/60 space-y-2">
        <li>Enable MFA for all admin accounts immediately after setup.</li>
        <li>Use the IP allowlist to restrict dashboard access to your corporate VPN or office IP range.</li>
        <li>Set session timeouts to 15 minutes or less for admin accounts.</li>
        <li>Review active sessions regularly and revoke any that appear suspicious.</li>
        <li>Keep audit log exports for compliance evidence and external review.</li>
      </ul>
    </div>
  )
}
