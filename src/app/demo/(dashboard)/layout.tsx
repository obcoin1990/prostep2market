import { DashboardLayoutClient } from '@/components/dashboard/DashboardLayoutClient'
import { DEMO_EMAIL } from '@/lib/demo/demo-data'

export default function DemoDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutClient userEmail={DEMO_EMAIL} userFullName="Demo Trader">
      {children}
    </DashboardLayoutClient>
  )
}
