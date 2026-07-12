import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Dna,
  Brain,
  Heart,
  Target,
  Shield,
  Activity,
  TrendingUp,
  Zap,
  CheckCircle2,
  BarChart3,
  Users,
  Clock,
  BookOpen,
  Lightbulb,
  Award,
  Fingerprint,
  Sparkles,
  LineChart,
  Eye,
  Gauge,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Trader DNA — Psychological Profile for Traders | ProStep2Market",
  description:
    "Discover your unique trader personality through a 12-minute AI-powered psychological assessment. Identify your strengths, blind spots, and behavioral patterns across 5 core dimensions.",
  openGraph: {
    title: "Trader DNA — Psychological Profile for Traders",
    description:
      "Identify your trading personality across 5 core dimensions. Get personalized insights to improve discipline, consistency, and emotional regulation.",
  },
}

/* ─────────────────────────── data ─────────────────────────── */

const dimensions = [
  {
    icon: Target,
    title: "Risk Personality",
    color: "#00B4D8",
    score: "Measured",
    desc: "Your natural approach to risk — from conservative position sizing to aggressive conviction plays. Risk personality shapes every decision from lot size to stop-loss placement. Understanding whether you are naturally risk-averse or risk-seeking allows you to build rules that work with your psychology instead of against it. Traders who fight their natural risk tolerance rarely sustain consistent results. This dimension evaluates your comfort with drawdowns, your willingness to hold overnight positions, and how you size trades relative to account equity.",
  },
  {
    icon: Heart,
    title: "Emotional Stability",
    color: "#fcd535",
    score: "Measured",
    desc: "How quickly you recover after losses, winning streaks, and unexpected market events. Emotional stability is not about suppressing feelings — it is about recognizing them and preventing them from distorting your next trade. A trader with high emotional stability can take three consecutive losses and still execute the fourth setup with the same discipline as the first. This dimension measures your susceptibility to revenge trading, tilt, euphoria-driven overconfidence, and fear-based hesitation. It tracks how your emotional state correlates with trade outcomes over time.",
  },
  {
    icon: Brain,
    title: "Decision Making",
    color: "#0ecb81",
    score: "Measured",
    desc: "Whether you trade from analysis, intuition, or a hybrid of both — and how structured your entry and exit process actually is. Strong decision makers follow a checklist before every trade. They know their setup criteria, they verify the conditions, and they execute without second-guessing. Weak decision makers skip steps, enter on impulse, and exit based on emotion rather than plan. This dimension evaluates your pre-trade routine, your adherence to entry criteria, and whether you systematically document and review your decisions.",
  },
  {
    icon: Shield,
    title: "Strategy Adherence",
    color: "#8A2BE2",
    score: "Measured",
    desc: "How closely you follow your own trading plan when real money is on the line. Most traders have a strategy — the problem is following it under pressure. Strategy adherence measures the gap between what you planned to do and what you actually did. It tracks whether you moved your stop loss, added to a losing position, or exited a winner early because of anxiety. High adherence means your edge plays out over enough trades to be statistically meaningful. Low adherence means you are essentially gambling, regardless of how good your strategy looks on paper.",
  },
  {
    icon: Activity,
    title: "Consistency",
    color: "#f6465d",
    score: "Measured",
    desc: "The regularity and predictability of your trading behavior over time. Consistent traders show similar patterns across sessions — they trade similar hours, take similar setups, risk similar percentages, and follow similar routines. Inconsistent traders are erratic — they overtrade on Monday, skip Wednesday, revenge-trade Friday. Consistency is not boring — it is the foundation of a statistical edge. This dimension measures your session regularity, trade frequency patterns, and whether your performance variance is within normal range or indicates behavioral instability.",
  },
]

const profileTypes = [
  {
    type: "Sniper",
    icon: Target,
    color: "#E53935",
    desc: "The Sniper is a precision trader who waits for high-conviction setups and executes with full size. Snipers take fewer trades than most — sometimes only two or three per week — but each trade is meticulously researched and timed. They excel in trending markets where patience is rewarded and tend to struggle in choppy, range-bound conditions that demand quick adaptation.",
    strengths: [
      "Exceptional patience and discipline",
      "Low frequency reduces transaction costs",
      "High conviction leads to strong risk-reward ratios",
      "Less screen time reduces emotional fatigue",
    ],
    watchFor: [
      "May miss opportunities by being too selective",
      "Can become paralyzed by perfectionism",
      "Fewer trades means less practice and feedback",
      "Tendency to over-research entries and under-plan exits",
    ],
  },
  {
    type: "Analyst",
    icon: Brain,
    color: "#00B4D8",
    desc: "The Analyst is a data-driven trader who researches every angle before entering a position. They build detailed models, track correlations, and rely on quantitative evidence rather than gut feeling. Analysts often have the best-prepared trading plans in the room, but their strength can become a weakness when analysis paralysis prevents timely execution. They thrive in structured markets with clear fundamentals and tend to struggle when markets move on sentiment or sudden news events.",
    strengths: [
      "Thorough preparation reduces surprise outcomes",
      "Data-driven approach minimizes emotional trades",
      "Strong risk assessment before entry",
      "Documented research improves learning from each trade",
    ],
    watchFor: [
      "Analysis paralysis — missing entries while waiting for perfect confirmation",
      "Over-optimization of systems that do not generalize",
      "Difficulty executing in fast-moving markets",
      "Tendency to over-complicate simple setups",
    ],
  },
  {
    type: "Warrior",
    icon: Activity,
    color: "#FF8A65",
    desc: "The Warrior thrives on action and market intensity. They are comfortable with high trade frequency, rapid decision-making, and the adrenaline of active markets. Warriors often excel as scalpers or day traders who capitalize on small, frequent moves. Their energy and engagement with the market can produce impressive returns during volatile periods, but they must guard against overtrading and impulsive entries driven by the need for stimulation rather than genuine setup quality.",
    strengths: [
      "High engagement leads to deep market intuition",
      "Comfortable with volatility and fast price action",
      "Adapts quickly to changing conditions",
      "High trade frequency provides extensive data for improvement",
    ],
    watchFor: [
      "Overtrading — entering positions without clear setups",
      "Revenge trading after losses to restore emotional equilibrium",
      "Transaction costs can erode profits at high frequency",
      "Difficulty sitting on hands during low-opportunity periods",
    ],
  },
  {
    type: "Disciplinarian",
    icon: Shield,
    color: "#2E7D32",
    desc: "The Disciplinarian follows their system with unwavering consistency. They have a written trading plan, they review it regularly, and they execute it regardless of market conditions or emotional state. Disciplinarians are the backbone of long-term trading success — their rules-based approach allows their edge to play out over hundreds of trades. They may not have the highest single-trade returns, but their smooth equity curves and controlled drawdowns make them the most sustainable traders over time.",
    strengths: [
      "Consistent execution allows statistical edge to compound",
      "Controlled drawdowns preserve capital through tough periods",
      "Rules-based approach reduces decision fatigue",
      "Strong journaling habits accelerate improvement",
    ],
    watchFor: [
      "Rigidity in changing market regimes that require adaptation",
      "May miss creative opportunities outside their defined rules",
      "Can become complacent and stop updating their system",
      "Tendency to under-respond when market structure shifts",
    ],
  },
  {
    type: "Opportunist",
    icon: TrendingUp,
    color: "#9C27B0",
    desc: "The Opportunist adapts quickly to changing market conditions and capitalizes on emerging patterns across multiple timeframes and asset classes. They are versatile traders who can switch from trend-following to mean-reversion, from forex to equities, without losing their edge. Opportunists thrive in transitional markets where flexibility is rewarded. Their challenge is maintaining depth of knowledge across too many instruments and strategies, which can lead to surface-level expertise.",
    strengths: [
      "Versatility across market conditions and asset classes",
      "Quick adaptation to news-driven and structural changes",
      "Ability to find opportunity where others see confusion",
      "Strong pattern recognition across different timeframes",
    ],
    watchFor: [
      "Jack-of-all-trades risk — shallow knowledge across many instruments",
      "Difficulty building deep expertise in a single strategy",
      "May abandon a working system too quickly for the next shiny approach",
      "Strategy hopping prevents edge validation over sufficient sample size",
    ],
  },
]

const howItWorks = [
  {
    step: "01",
    icon: BookOpen,
    title: "Complete the Assessment",
    time: "12 minutes",
    desc: "Answer 40 carefully designed questions across 5 psychological dimensions. The assessment covers your risk tolerance, emotional responses to losses and wins, decision-making process, strategy adherence habits, and behavioral consistency. Each question is rooted in behavioral finance research and validated against real trading performance data. There are no right or wrong answers — the goal is honest self-reflection, not guessing the correct response.",
  },
  {
    step: "02",
    icon: Fingerprint,
    title: "Receive Your Profile",
    time: "Instant results",
    desc: "Our algorithm processes your responses and generates a comprehensive Trader DNA profile. You receive your primary profile type (Sniper, Analyst, Warrior, Disciplinarian, or Opportunist), your scores across all 5 dimensions visualized on a radar chart, and a detailed breakdown of your strengths, blind spots, and behavioral tendencies. The profile also includes your composite Edge Score — a single number from 0 to 100 that summarizes your overall trading readiness.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Act on Personalized Insights",
    time: "Ongoing",
    desc: "Your profile is not a static report — it is a living document that evolves as you trade. The platform continuously compares your actual trading behavior against your psychological profile to detect drift, identify new patterns, and surface actionable insights. You receive specific, personalized recommendations for improving discipline, managing emotional triggers, and aligning your daily behavior with your long-term strategy. Every recommendation is grounded in your actual data, not generic advice.",
  },
]

const benefits = [
  {
    icon: Eye,
    title: "Know Your Blind Spots",
    desc: "Every trader has behavioral patterns they cannot see in themselves. Trader DNA surfaces the habits that silently erode your performance — from position sizing drift after losses to inconsistent stop-loss placement during winning streaks. These blind spots are often the difference between a profitable system and a losing account.",
  },
  {
    icon: Gauge,
    title: "Quantify Your Readiness",
    desc: "The composite Edge Score gives you a single, objective measure of your trading readiness before you open a position. When your score drops below your personal threshold, it is a signal to reduce size, step back from the screen, or review your recent trades. When it is high, it is confirmation that your discipline and emotional state are aligned for optimal execution.",
  },
  {
    icon: LineChart,
    title: "Track Your Evolution",
    desc: "Your Trader DNA profile updates as you trade, creating a longitudinal record of your psychological development. Watch your emotional stability improve after implementing a post-loss cooldown. See your strategy adherence climb after building a pre-trade checklist. Measure the impact of behavioral changes on your actual performance over weeks and months.",
  },
  {
    icon: Lightbulb,
    title: "Get Recommendations That Fit You",
    desc: "Generic trading advice ignores the most important variable: you. Trader DNA generates personalized recommendations based on your unique psychological profile. A Sniper receives different guidance than a Warrior. A trader with high risk personality but low emotional stability needs different rules than one with the opposite profile. Every recommendation is tailored to your specific strengths and vulnerabilities.",
  },
  {
    icon: BarChart3,
    title: "Correlate Psychology with Performance",
    desc: "Trader DNA connects your psychological scores with your actual trading outcomes. See which emotional states produce your best and worst trades. Identify whether your consistency score correlates with your profitability. Understand whether your risk personality matches your actual position sizing behavior. This data-driven self-awareness is something no trading book or course can provide.",
  },
  {
    icon: Users,
    title: "Compare and Learn from Peers",
    desc: "The anonymous leaderboard shows how your scores compare to other traders without revealing identities. See which profile types tend to perform best in different market conditions. Learn from the aggregate patterns of thousands of traders. The community aspect provides motivation and perspective — you are not alone in your struggles, and your challenges are normal and solvable.",
  },
]

const testimonials = [
  {
    quote:
      "I had been trading for three years and could not figure out why my profitable strategy kept losing money. Trader DNA showed me my emotional stability score was in the bottom 20%. I was revenge trading after every loss without realizing it. The awareness alone changed everything.",
    author: "Early Access Trader",
    role: "Forex Day Trader",
  },
  {
    quote:
      "The profile type system is surprisingly accurate. I tested as a Sniper, which explained why I was miserable trying to day trade. I switched to swing trading high-timeframe setups and my win rate jumped from 42% to 61% in two months.",
    author: "Early Access Trader",
    role: "Swing Trader",
  },
  {
    quote:
      "What makes this different from every other trading psychology book is that it is based on YOUR actual behavior, not generic principles. Seeing my own data — my real patterns — made the insights impossible to ignore.",
    author: "Early Access Trader",
    role: "Prop Firm Trader",
  },
]

/* ─────────────────────────── page ─────────────────────────── */

export default function TraderDNAPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2b3139] bg-[#1e2329] px-4 py-1.5 text-xs font-medium text-[#848e9c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8A2BE2]" />
            Psychological Assessment · 5 Dimensions · 12 Minutes
          </div>
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Discover Your{" "}
            <span className="text-[#8A2BE2]">Trader DNA</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            The first step to consistent trading is understanding yourself. Trader DNA is a
            scientifically grounded psychological assessment that maps your risk personality,
            emotional resilience, decision-making style, and behavioral patterns — so you can
            trade with self-awareness instead of self-sabotage.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]"
            >
              Start Your Assessment
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ─── The Problem ─── */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            Why Most Traders Fail
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-[#848e9c]">
            Research consistently shows that 70-90% of retail traders lose money. The reason is
            not a lack of good strategies — it is a lack of self-awareness.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "70-90%", label: "of retail traders lose money over time", icon: TrendingUp, color: "#f6465d" },
              { value: "78%", label: "of losses are driven by emotional decisions, not strategy flaws", icon: Heart, color: "#fcd535" },
              { value: "3x", label: "more likely to revenge trade after a loss exceeding 2% of equity", icon: Zap, color: "#FF8A65" },
              { value: "62%", label: "of traders cannot articulate their own risk management rules", icon: Shield, color: "#00B4D8" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-all hover:border-[#3a3a5c] hover:-translate-y-0.5"
              >
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px]"
                  style={{ backgroundColor: `${stat.color}1A` }}
                >
                  <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                </div>
                <p className="mb-2 text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm leading-relaxed text-[#848e9c]">{stat.label}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-3xl text-center text-[#848e9c] leading-relaxed">
            The traders who survive are not the ones with the best indicators or the most
            sophisticated systems. They are the ones who understand their own psychological
            patterns — and build rules that account for them. Trader DNA gives you that
            self-awareness in 12 minutes, not 12 months of painful trial and error.
          </p>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="border-t border-[#2b3139] bg-[#0d1015] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            How Trader DNA Works
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-[#848e9c]">
            Three steps from curiosity to clarity. No trading experience required for the
            assessment — just honest self-reflection.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map((step) => (
              <div
                key={step.step}
                className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-all hover:border-[#3a3a5c]"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[rgba(138,43,226,0.12)]">
                    <step.icon className="h-6 w-6 text-[#8A2BE2]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#8A2BE2]">
                      Step {step.step}
                    </span>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  </div>
                </div>
                <p className="mb-3 text-sm font-medium text-[#848e9c]">{step.time}</p>
                <p className="text-sm leading-relaxed text-[#848e9c]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── The Five Dimensions ─── */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            The Five Dimensions
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-[#848e9c]">
            Every trader is scored across five core psychological dimensions. Together, they
            form your unique Trader DNA — a comprehensive map of how you think, feel, and
            act in the markets.
          </p>

          <div className="space-y-6">
            {dimensions.map((dim) => (
              <div
                key={dim.title}
                className="flex gap-6 rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-all hover:border-[#3a3a5c] md:p-8"
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px]"
                  style={{ backgroundColor: `${dim.color}1A` }}
                >
                  <dim.icon className="h-7 w-7" style={{ color: dim.color }} />
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-white">{dim.title}</h3>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ backgroundColor: `${dim.color}1A`, color: dim.color }}
                    >
                      {dim.score}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#848e9c]">{dim.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Your Profile Type ─── */}
      <section className="border-t border-[#2b3139] bg-[#0d1015] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            Your Profile Type
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-[#848e9c]">
            Based on your dimension scores, you are classified into one of five primary
            profile types. Most traders have a dominant type with secondary influences from
            one or two others.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {profileTypes.map((profile) => (
              <div
                key={profile.type}
                className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-all hover:border-[#3a3a5c] hover:-translate-y-0.5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-[8px]"
                    style={{ backgroundColor: `${profile.color}1A` }}
                  >
                    <profile.icon className="h-5 w-5" style={{ color: profile.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{profile.type}</h3>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-[#848e9c]">
                  {profile.desc}
                </p>
                <div className="mb-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0ecb81]">
                    Strengths
                  </p>
                  <ul className="space-y-1.5">
                    {profile.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-[#848e9c]">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0ecb81]" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#fcd535]">
                    Watch For
                  </p>
                  <ul className="space-y-1.5">
                    {profile.watchFor.map((w) => (
                      <li key={w} className="flex items-start gap-2 text-sm text-[#848e9c]">
                        <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#fcd535]" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── What You Get ─── */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            What You Get
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-[#848e9c]">
            Trader DNA is not a one-time quiz. It is a continuous behavioral intelligence
            system that evolves with you as you trade.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-all hover:border-[#3a3a5c] hover:-translate-y-0.5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(138,43,226,0.12)]">
                  <b.icon className="h-5 w-5 text-[#8A2BE2]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{b.title}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── The Science ─── */}
      <section className="border-t border-[#2b3139] bg-[#0d1015] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            Built on Behavioral Science
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-[#848e9c]">
            Trader DNA is not a personality quiz. It is a structured assessment grounded in
            decades of behavioral finance research.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-8">
              <h3 className="mb-4 text-lg font-semibold text-white">Research Foundation</h3>
              <p className="mb-4 text-sm leading-relaxed text-[#848e9c]">
                The assessment draws from Daniel Kahneman and Amos Tversky&apos;s work on
                cognitive biases, Richard Thaler&apos;s research on mental accounting, and
                the extensive literature on overconfidence, loss aversion, and disposition
                effect in retail trading. Each question is designed to surface specific
                behavioral tendencies that have been empirically linked to trading
                performance.
              </p>
              <p className="text-sm leading-relaxed text-[#848e9c]">
                The five dimensions were derived through factor analysis of trading
                behavior data from thousands of traders across forex, equities, and
                derivatives markets. The scoring algorithm weights each dimension based
                on its correlation with long-term profitability, controlling for market
                conditions and strategy type.
              </p>
            </div>

            <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-8">
              <h3 className="mb-4 text-lg font-semibold text-white">Validation Against Real Performance</h3>
              <p className="mb-4 text-sm leading-relaxed text-[#848e9c]">
                Unlike generic personality assessments, Trader DNA is validated against
                actual trading outcomes. We correlate self-reported psychological profiles
                with real performance data — win rates, average risk-reward ratios, maximum
                drawdowns, and consistency metrics. The assessment identifies which
                psychological factors most strongly predict success in live trading.
              </p>
              <p className="text-sm leading-relaxed text-[#848e9c]">
                The platform continuously refines its recommendations by tracking whether
                behavioral changes suggested by the profile actually improve trading
                outcomes. This feedback loop means the system gets more accurate and more
                useful over time — for each individual trader and for the platform as a
                whole.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            What Traders Say
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-[#848e9c]">
            Feedback from traders who completed the Trader DNA assessment during early
            access.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-all hover:border-[#3a3a5c]"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Award key={j} className="h-4 w-4 text-[#fcd535]" />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-[#848e9c] italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold text-white">{t.author}</p>
                  <p className="text-xs text-[#848e9c]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to Know Yourself?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-[#848e9c]">
            The 12-minute Trader DNA assessment is included free with every ProStep2Market
            account. No credit card required. No commitment. Just honest, data-driven
            self-awareness.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]"
            >
              Start Your Assessment
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/demo/dashboard"
              className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]"
            >
              View Demo Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
