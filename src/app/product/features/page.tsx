import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Dna, BookMarked, Sparkles, ShieldAlert, Trophy, FlaskConical, Brain, BarChart3, Camera, Upload, Link2, Clock, Target, RefreshCw, Sliders, Activity, PenTool, CheckCircle2, TrendingUp, Users, Globe, Download, Bell, Filter, PieChart, GitBranch, BookOpen, Award, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Features — ProStep2Market",
  description: "Explore 40+ features across 8 integrated modules. Trader DNA profiling, AI trade analysis, risk management, strategy simulation, and more.",
  openGraph: { title: "ProStep2Market Features", description: "Every tool you need to become a consistent, profitable trader." },
}

const featureCategories = [
  {
    title: "Trader DNA",
    icon: Dna,
    color: "#8b5cf6",
    features: [
      { icon: Activity, name: "16-Dimension Personality Profile", desc: "Comprehensive behavioral assessment across risk tolerance, emotional regulation, discipline, and 13 other dimensions." },
      { icon: BarChart3, name: "Behavioral Scoring", desc: "Quantitative scores for each dimension with percentile rankings against the trader community." },
      { icon: TrendingUp, name: "Trait Evolution Tracking", desc: "Watch your behavioral profile evolve over time as you trade and learn." },
      { icon: Target, name: "Personalized Weakness ID", desc: "AI identifies your specific behavioral blind spots and suggests targeted improvements." },
      { icon: RefreshCw, name: "Retest & Compare", desc: "Retake assessments quarterly and compare your growth across dimensions." },
    ],
  },
  {
    title: "AI Trade Intelligence",
    icon: Sparkles,
    color: "#fcd535",
    features: [
      { icon: MessageSquare, name: "GPT-Powered Trade Review", desc: "Every trade gets an AI analysis that identifies patterns, mistakes, and improvement opportunities." },
      { icon: Brain, name: "Pattern Recognition", desc: "AI detects recurring behavioral patterns — revenge trading, FOMO, over-leveraging — before they become habits." },
      { icon: Sliders, name: "Sentiment Analysis", desc: "Analyzes your journal entries for emotional state and correlates sentiment with trading outcomes." },
      { icon: Bell, name: "Actionable Insights", desc: "Daily personalized coaching tips based on your recent trading behavior." },
      { icon: Clock, name: "Historical Trend Analysis", desc: "Track how your decision-making quality changes over weeks and months." },
    ],
  },
  {
    title: "Trade Journal",
    icon: BookMarked,
    color: "#3b82f6",
    features: [
      { icon: Link2, name: "MT4/MT5 Auto-Sync", desc: "One-click connection. Trades import automatically with full metadata including entry/exit, PnL, and duration." },
      { icon: Camera, name: "Screenshot Capture", desc: "Annotate chart screenshots directly in your journal entries. Visual evidence for every trade decision." },
      { icon: PenTool, name: "Structured Journaling", desc: "Guided entry templates that capture your mindset, strategy, setup quality, and exit discipline." },
      { icon: Filter, name: "Advanced Search & Filter", desc: "Find any trade instantly by date, symbol, strategy, emotion, outcome, or custom tags." },
      { icon: Download, name: "Export & Reports", desc: "Export your complete journal to PDF or CSV. Generate performance reports for your own analysis." },
    ],
  },
  {
    title: "Risk Guardian",
    icon: ShieldAlert,
    color: "#ef4444",
    features: [
      { icon: Bell, name: "Real-Time Risk Alerts", desc: "Configurable alerts for drawdown limits, position size violations, consecutive losses, and more." },
      { icon: ShieldAlert, name: "Circuit Breakers", desc: "Automatically pause trading when risk parameters are breached. Protect yourself from emotional decisions." },
      { icon: Sliders, name: "Custom Risk Rules", desc: "Set your own risk parameters — max daily loss, max position size, max leverage, min risk-reward ratio." },
      { icon: Activity, name: "Risk Score", desc: "Real-time risk exposure score that combines position sizing, market volatility, and your personal risk profile." },
      { icon: Clock, name: "Session Limits", desc: "Set trading session time limits to prevent overtrading and fatigue-driven mistakes." },
    ],
  },
  {
    title: "Edge Score",
    icon: Trophy,
    color: "#f59e0b",
    features: [
      { icon: Award, name: "Proprietary Algorithm", desc: "A scientifically validated score that measures true trading consistency across 12 weighted factors." },
      { icon: TrendingUp, name: "Score History", desc: "Track your Edge Score over time with granular breakdowns of what's improving and what needs work." },
      { icon: Users, name: "Leaderboards", desc: "Compare your Edge Score anonymously against traders with similar experience levels and strategies." },
      { icon: Target, name: "Improvement Targets", desc: "AI-recommended specific actions to raise your Edge Score based on your weakest areas." },
      { icon: CheckCircle2, name: "Milestone Badges", desc: "Earn badges and achievements as you hit consistency milestones — a gamified path to mastery." },
    ],
  },
  {
    title: "Strategy Lab",
    icon: FlaskConical,
    color: "#10b981",
    features: [
      { icon: GitBranch, name: "Visual Strategy Builder", desc: "Drag-and-drop strategy builder with technical indicators, entry/exit rules, and risk parameters." },
      { icon: Clock, name: "Backtesting Engine", desc: "Test strategies against years of historical data with realistic slippage and commission modeling." },
      { icon: RefreshCw, name: "Paper Trading", desc: "Run strategies in real-time with virtual capital before deploying them in live markets." },
      { icon: BarChart3, name: "Performance Analytics", desc: "Comprehensive strategy metrics: Sharpe ratio, max drawdown, win rate, profit factor, and more." },
      { icon: PieChart, name: "Portfolio Simulation", desc: "Run multiple strategies simultaneously and analyze portfolio-level risk and return characteristics." },
    ],
  },
  {
    title: "Education",
    icon: Brain,
    color: "#06b6d4",
    features: [
      { icon: BookOpen, name: "Structured Learning Paths", desc: "Curated learning paths from beginner to advanced, covering technical analysis, psychology, and risk management." },
      { icon: Award, name: "Certification Program", desc: "Earn verified certificates for completing learning paths. Showcase your expertise to prop firms and employers." },
      { icon: MessageSquare, name: "Interactive Quizzes", desc: "Test your knowledge with scenario-based quizzes that simulate real trading decisions." },
      { icon: Users, name: "Expert-Led Courses", desc: "Courses created by professional traders and behavioral psychologists with decades of experience." },
      { icon: TrendingUp, name: "Progress Tracking", desc: "Track your learning progress alongside your trading performance. See how knowledge translates to results." },
    ],
  },
  {
    title: "Analytics & Reports",
    icon: BarChart3,
    color: "#ec4899",
    features: [
      { icon: PieChart, name: "40+ Performance Metrics", desc: "Comprehensive metrics including Sharpe, Sortino, Calmar ratios, win rate, expectancy, and custom KPIs." },
      { icon: Activity, name: "Visual Trend Analysis", desc: "Interactive charts showing your performance trends across any time period with customizable date ranges." },
      { icon: Download, name: "Custom Reports", desc: "Generate professional PDF reports with your metrics, analysis, and improvement recommendations." },
      { icon: Globe, name: "Multi-Account View", desc: "Aggregate performance across multiple broker accounts for a complete picture of your trading." },
      { icon: Filter, name: "Segment Analysis", desc: "Break down performance by symbol, strategy, day of week, time of day, market condition, and more." },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            40+ Features Across{" "}
            <span className="text-[#fcd535]">8 Integrated Modules</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Every feature designed to work together. Your Trader DNA informs your Risk Guardian. 
            Your journal feeds your AI analysis. Your Edge Score tracks your growth.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Start Building Consistency <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Feature Categories */}
      {featureCategories.map((cat) => (
        <section key={cat.title} className="border-t border-[#2b3139] py-20">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="mb-12 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[10px]" style={{ backgroundColor: `${cat.color}1A` }}>
                <cat.icon className="h-6 w-6" style={{ color: cat.color }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{cat.title}</h2>
                <p className="text-sm text-[#848e9c]">{cat.features.length} features</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cat.features.map((f) => (
                <div key={f.name} className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-5 transition-colors hover:border-[#3a3a5c]">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[rgba(252,213,53,0.1)]">
                      <f.icon className="h-4 w-4 text-[#fcd535]" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">{f.name}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#848e9c]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Experience Every Feature</h2>
          <p className="mb-8 text-[#848e9c]">Start your free trial and explore the complete platform.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
