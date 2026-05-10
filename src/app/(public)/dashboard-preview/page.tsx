import { TraderDNASection } from '@/components/landing/TraderDNASection'
import { AIRiskGuardianSection } from '@/components/landing/AIRiskGuardianSection'
import { DashboardPreview } from '@/components/landing/DashboardPreview'

export default function DashboardPreviewPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <DashboardPreview />
      <TraderDNASection />
      <AIRiskGuardianSection />
    </main>
  )
}
