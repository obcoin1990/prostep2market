import { UserDashboardClient } from '@/app/dashboard/user/client'
import { demoTraderProfile, demoEdgeScores, demoTrades, DEMO_EMAIL } from '@/lib/demo/demo-data'

const latestScore = demoEdgeScores[demoEdgeScores.length - 1]

export default function DemoUserDashboard() {
  return (
    <UserDashboardClient
      userEmail={DEMO_EMAIL}
      userName="Demo Trader"
      profile={demoTraderProfile}
      tradeCount={demoTrades.length}
      edgeScore={latestScore}
    />
  )
}
