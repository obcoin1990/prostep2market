'use client'

export default function AdminOverview() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard Overview</h1>
      <p className="text-white/60 mb-8">
        The Admin Dashboard provides full control over your ProStep2Market instance. Manage users, monitor system health, configure billing, and ensure compliance — all from one central hub.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Accessing Admin</h2>
      <p className="text-white/60 mb-4">
        Navigate to <span className="text-[#fcd535] font-mono text-sm">/admin</span> from your account menu. You must have an administrator role assigned by another admin or provisioned during initial setup. If you cannot access the panel, contact your instance owner.
      </p>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 rounded mb-8">
        <p className="text-white/80 text-sm">
          <strong className="text-[#fcd535]">Tip:</strong> Bookmark the admin URL for quick access. Session timeouts are shorter on admin pages for security.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Dashboard Widgets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Active Users</h3>
          <p className="text-white/60 text-sm">Real-time count of currently active sessions, broken down by role and recent activity.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">System Health</h3>
          <p className="text-white/60 text-sm">CPU, memory, and API latency indicators. Green = healthy, Yellow = degraded, Red = critical.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">New Registrations</h3>
          <p className="text-white/60 text-sm">Daily sign-up count with a 7-day trend chart. Spot unusual spikes or drops at a glance.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Revenue Snapshot</h3>
          <p className="text-white/60 text-sm">MRR, churn rate, and pending invoices. Click through to the Billing section for details.</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1 text-[#fcd535]">User Management</h3>
          <p className="text-white/60 text-sm">Create, edit, suspend, or delete users. Assign roles and manage permissions.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1 text-[#fcd535]">Security Center</h3>
          <p className="text-white/60 text-sm">Configure MFA, session policies, IP allowlists, and view audit logs.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1 text-[#fcd535]">Billing Portal</h3>
          <p className="text-white/60 text-sm">Manage subscriptions, view invoices, process refunds, and configure payment methods.</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">User Management</h2>
      <p className="text-white/60 mb-4">
        From the Users page you can view all registered accounts, filter by role or status, and perform bulk actions. Each user profile shows account details, login history, and current subscription tier. Admins can impersonate a user for troubleshooting with the &quot;Login As&quot; feature.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">System Monitoring</h2>
      <p className="text-white/60 mb-4">
        The System Monitoring panel displays server metrics, error rates, and API usage statistics. Set up alert thresholds to receive notifications when CPU exceeds 80%, error rates spike, or disk space runs low. Logs are retained for 90 days and can be exported for external analysis.
      </p>
    </div>
  )
}
