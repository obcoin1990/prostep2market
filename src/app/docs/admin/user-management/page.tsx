'use client'

const ROLES = [
  { name: 'Admin', description: 'Full system access — manage users, billing, security settings, and all configurations.' },
  { name: 'Manager', description: 'Can view and manage users, access reports, but cannot modify billing or security policies.' },
  { name: 'Support', description: 'Read-only access to user profiles and journals. Can reply to support tickets only.' },
  { name: 'User', description: 'Standard trader account. Dashboard, journaling, analytics, and personal settings.' },
]

export default function UserManagementGuide() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">User Management Guide</h1>
      <p className="text-white/60 mb-8">
        Manage all registered users from the Admin panel. Create accounts, edit profiles, assign roles, and control access to platform features.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">1. Viewing Users</h2>
      <p className="text-white/60 mb-4">
        Navigate to the Users section from the Admin sidebar. The user list displays all accounts with columns for name, email, role, status (Active / Suspended / Pending), and last login. Use the search bar to find a specific user by name or email. Filters let you narrow results by role, status, or date range.
      </p>
      <p className="text-white/60 mb-4">
        Click any row to open the user detail panel. From there you can view full profile information, login history, session count, and subscription tier.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">2. Creating Users</h2>
      <p className="text-white/60 mb-4">
        Click the &quot;Create User&quot; button in the top-right corner of the Users page. Fill in the required fields:
      </p>
      <ul className="list-disc list-inside text-white/60 space-y-1 mb-4">
        <li><strong className="text-white">Full Name</strong> — The user&apos;s display name.</li>
        <li><strong className="text-white">Email Address</strong> — Used for login and notifications.</li>
        <li><strong className="text-white">Role</strong> — Select from Admin, Manager, Support, or User.</li>
        <li><strong className="text-white">Password</strong> — Minimum 8 characters with mixed case and numbers.</li>
      </ul>
      <p className="text-white/60 mb-8">
        Optionally, send an invite email that lets the user set their own password. New users default to Active status.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">3. Editing Profiles</h2>
      <p className="text-white/60 mb-4">
        Open a user&apos;s detail panel and click &quot;Edit Profile.&quot; You can update their name, email, profile picture, timezone, and notification preferences. Changes take effect immediately and are logged in the audit trail.
      </p>
      <p className="text-white/60 mb-8">
        To reset a user&apos;s password, click &quot;Reset Password.&quot; The user will receive a password reset email. Admins can also set a temporary password manually for testing accounts.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">4. Managing Roles</h2>
      <p className="text-white/60 mb-4">
        Roles determine what a user can see and do within the platform. Choose the appropriate role when creating or editing a user:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {ROLES.map((role) => (
          <div key={role.name} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-white font-medium mb-1 text-[#fcd535]">{role.name}</h3>
            <p className="text-white/60 text-sm">{role.description}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">5. Suspending Accounts</h2>
      <p className="text-white/60 mb-4">
        To temporarily disable access, open the user&apos;s detail panel and click &quot;Suspend Account.&quot; A suspended user cannot log in or make API requests. All active sessions are immediately revoked.
      </p>
      <p className="text-white/60 mb-4">
        You can optionally provide a reason (visible only to admins). To reinstate an account, click &quot;Reactivate.&quot; For permanent removal, use &quot;Delete Account&quot; — this action is irreversible and removes all associated data.
      </p>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 rounded">
        <p className="text-white/80 text-sm">
          <strong className="text-[#fcd535]">Warning:</strong> Deleting an account cannot be undone. Consider suspending first to ensure the right decision.
        </p>
      </div>
    </div>
  )
}
