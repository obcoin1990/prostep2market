'use client'

const METRICS = [
  { label: 'Monthly Recurring Revenue', value: '$12,450', change: '+8.2%' },
  { label: 'Active Subscriptions', value: '342', change: '+12' },
  { label: 'Churn Rate', value: '3.1%', change: '-0.4%' },
  { label: 'Pending Invoices', value: '7', change: '$2,340' },
]

export default function BillingGuide() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">Billing & Subscriptions</h1>
      <p className="text-white/60 mb-8">
        Manage subscriptions, process payments, and track revenue from the Billing section of the Admin Dashboard.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Overview Dashboard</h2>
      <p className="text-white/60 mb-4">
        The Billing Dashboard displays key revenue and subscription metrics at a glance:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-white">{m.value}</p>
            <p className="text-sm text-green-400">{m.change}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Subscription Management</h2>
      <p className="text-white/60 mb-4">
        View all active, canceled, and past-due subscriptions from the Subscriptions page. Each row shows the subscriber name, plan tier, billing cycle (monthly/yearly), status, and next billing date.
      </p>
      <p className="text-white/60 mb-4">
        Click into a subscription to upgrade or downgrade the plan, change the billing cycle, or cancel the subscription. When canceling, choose whether to revoke access immediately or at the end of the current billing period.
      </p>
      <p className="text-white/60 mb-8">
        Bulk operations let you export subscriptions to CSV or apply plan changes to multiple accounts at once.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Payment Processing</h2>
      <p className="text-white/60 mb-4">
        The Payment Processing page shows all transactions processed through your configured payment gateway (Stripe, PayPal, or both). Filter by date range, status (completed, pending, failed, refunded), and payment method.
      </p>
      <p className="text-white/60 mb-4">
        Retry failed payments manually or configure automatic retry logic with up to 3 attempts over 5 days. Failed payment notifications are sent to both the admin and the affected user.
      </p>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 rounded mb-8">
        <p className="text-white/80 text-sm">
          <strong className="text-[#fcd535]">Tip:</strong> Set up webhook endpoints in Settings to receive real-time payment event notifications.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Invoices</h2>
      <p className="text-white/60 mb-4">
        All generated invoices are stored in the Invoices section. Each invoice includes a unique number, billing period, line items, taxes, and total. Generate PDF copies for download or email delivery to the customer.
      </p>
      <p className="text-white/60 mb-8">
        Override invoice details manually for one-off adjustments. Void incorrect invoices — voided invoices remain in history but are marked as cancelled.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-4">Refunds</h2>
      <p className="text-white/60 mb-4">
        Process refunds directly from the transaction or invoice detail page. Choose between full and partial refunds. The system will process the refund through the original payment method and send a confirmation email to the user.
      </p>
      <p className="text-white/60">
        Refunds are logged in the audit trail with the admin ID, reason, and amount. Configure a refund policy in Settings to set time windows and approval workflows for refund requests.
      </p>
    </div>
  )
}
