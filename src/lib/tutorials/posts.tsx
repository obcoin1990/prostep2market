import type { ReactNode } from "react"

export interface TutorialPost {
  title: string
  slug: string
  category: string
  desc: string
  difficulty: string
  time: string
  author: string
  date: string
  content: ReactNode
}

function makeStub(desc: string): ReactNode {
  return (
    <>
      <p>
        This tutorial is being expanded with detailed step-by-step instructions,
        screenshots, and platform walkthroughs. Check back soon for the complete
        version.
      </p>
      <h2>Overview</h2>
      <p>{desc}</p>
      <h2>Prerequisites</h2>
      <ul>
        <li>An active ProStep2Market account</li>
        <li>Basic familiarity with the dashboard</li>
      </ul>
      <h2>What You Will Learn</h2>
      <ul>
        <li>Step-by-step setup process</li>
        <li>Configuration best practices</li>
        <li>Common pitfalls and how to avoid them</li>
      </ul>
    </>
  )
}

const tutorial1Content = (
  <>
    <p>
      Connecting your MetaTrader 4 or MetaTrader 5 account to ProStep2Market
      enables automatic trade synchronization, real-time performance tracking,
      and behavioral analysis. This tutorial walks through the complete setup
      process.
    </p>

    <h2>Prerequisites</h2>
    <ul>
      <li>An active MT4 or MT5 account with a broker</li>
      <li>Your ProStep2Market account</li>
      <li>Your broker server name (visible in the MT4/MT5 login screen)</li>
    </ul>

    <h2>Step 1: Access the Connections Page</h2>
    <p>
      Log in to ProStep2Market and navigate to Dashboard then Connections from
      the sidebar. Click the Connect Account button and select MetaTrader 4 or
      MetaTrader 5 from the list of available platforms.
    </p>

    <h2>Step 2: Enter Your MT4/MT5 Credentials</h2>
    <p>
      Enter your MT4 or MT5 account number (the numeric login, not your email).
      Enter your investor password — this is the read-only password that allows
      ProStep2Market to view your trades without the ability to execute new
      ones. Your investor password is separate from your trading password and
      can be set or changed in your MT4/MT5 platform under Tools then Options
      then Server.
    </p>

    <h2>Step 3: Select Your Broker Server</h2>
    <p>
      Choose your broker from the dropdown list. If your broker is not listed,
      select Other and enter the server address manually. The server address
      is visible in the MT4/MT5 login screen — it typically looks like
      BrokerName-Live or BrokerName-Demo.
    </p>

    <h2>Step 4: Verify the Connection</h2>
    <p>
      After submitting your credentials, ProStep2Market will attempt to connect
      to your account. This usually takes less than 30 seconds. If successful,
      you will see a green Connected status indicator and your recent trades
      will begin appearing in the dashboard within a few minutes.
    </p>

    <h2>Step 5: Configure Sync Settings</h2>
    <p>
      Once connected, configure your sync settings. Choose how many months of
      historical data to import (we recommend at least 3 months for meaningful
      analysis). Enable or disable real-time sync — real-time sync provides
      instant updates but uses slightly more resources.
    </p>

    <h2>Common Issues</h2>
    <p>
      <strong>Connection fails.</strong> Double-check your account number and
      investor password. Ensure your broker account is active and not locked.
      Some brokers require you to enable external connections in your account
      settings.
    </p>
    <p>
      <strong>Missing trades.</strong> Historical import can take up to 15
      minutes for accounts with large trade histories. If trades are still
      missing after 15 minutes, disconnect and reconnect to trigger a full
      resync.
    </p>
    <p>
      <strong>Delayed updates.</strong> Real-time sync updates every 5 seconds.
      If you notice longer delays, check your internet connection and try
      refreshing the dashboard.
    </p>
  </>
)

const tutorial2Content = (
  <>
    <p>
      The Trader DNA assessment is a behavioral profiling tool that measures
      your trading psychology across 16 dimensions. Completing the assessment
      takes approximately 15 minutes and produces a detailed profile that
      guides your improvement plan.
    </p>

    <h2>Before You Start</h2>
    <p>
      Complete the assessment during a calm, focused state. Do not take it
      immediately after a large win or loss — your emotional state will skew
      the results. The assessment asks about your typical behavior over the
      past 30 days, not your ideal behavior. Answer honestly based on what
      you actually do, not what you believe you should do.
    </p>

    <h2>Step 1: Navigate to Trader DNA</h2>
    <p>
      From your dashboard, click Trader DNA in the sidebar. If you have not
      completed an assessment, you will see the option to start one. Click
      Begin Assessment.
    </p>

    <h2>Step 2: Complete the Questionnaire</h2>
    <p>
      The assessment contains 80 questions across the five core dimensions.
      Each question presents a trading scenario and asks you to select the
      response that most closely matches your typical behavior. There are no
      right or wrong answers. The assessment is designed to measure your
      natural tendencies, not to test your knowledge.
    </p>
    <p>
      Answer each question quickly based on your gut reaction. Overthinking
      the questions tends to produce answers that reflect your aspirations
      rather than your actual behavior, which reduces the accuracy of your
      profile.
    </p>

    <h2>Step 3: Review Your Profile</h2>
    <p>
      After completing the questionnaire, your profile is generated
      immediately. You will see your scores across all 16 sub-dimensions,
      your overall profile type, and your strongest and weakest areas. The
      profile includes specific recommendations based on your results.
    </p>

    <h2>Step 4: Interpret Your Results</h2>
    <p>
      Focus first on your weakest two or three dimensions. These are the areas
      where behavioral improvement will have the largest impact on your
      trading performance. The profile provides specific exercises and
      platform tools for each dimension. Complete the recommended exercises
      over the following 30 days.
    </p>

    <h2>Step 5: Retake Periodically</h2>
    <p>
      Retake the assessment every 90 days to track your behavioral
      development. Compare your scores across assessments to identify which
      dimensions are improving and which need continued attention. The goal
      is not to reach a perfect score — it is to achieve balance across
      dimensions that supports your trading style.
    </p>
  </>
)

const tutorial3Content = (
  <>
    <p>
      Risk Guardian is ProStep2Market's automated risk management system. It
      monitors your trading in real-time and enforces the risk rules you
      configure. This tutorial covers the complete setup process.
    </p>

    <h2>Understanding Risk Guardian</h2>
    <p>
      Risk Guardian operates as an automated compliance layer between you and
      your trading account. Once configured, it enforces position limits,
      drawdown stops, daily loss limits, and other risk parameters without
      requiring you to rely on willpower or memory. The system can alert you
      when limits are approached and can automatically restrict new positions
      when limits are reached.
    </p>

    <h2>Step 1: Access Risk Guardian</h2>
    <p>
      From your dashboard, navigate to Risk Guardian in the sidebar. The
      main screen shows your current risk status, including open position
      exposure, daily P and L, and proximity to any configured limits.
    </p>

    <h2>Step 2: Configure Position Limits</h2>
    <p>
      Set your maximum risk per trade as a percentage of your account equity.
      We recommend 0.5 percent for traders with fewer than 100 trades and
      1 percent for experienced traders. Set your maximum number of concurrent
      positions. For most traders, 3 to 5 positions is appropriate. Set your
      maximum total portfolio exposure as a percentage of account equity.
    </p>

    <h2>Step 3: Configure Drawdown Limits</h2>
    <p>
      Set your daily loss limit, weekly loss limit, and monthly loss limit.
      When any limit is reached, Risk Guardian will prevent new positions from
      being opened until the next period begins. These limits should be set
      based on your account size and risk tolerance, but the framework
      recommends 2 percent daily, 5 percent weekly, and 10 percent monthly.
    </p>

    <h2>Step 4: Configure Alerts</h2>
    <p>
      Set alert thresholds at 75 percent and 90 percent of each limit. Alerts
      are delivered via email, push notification, or both, depending on your
      notification preferences. The 75 percent alert gives you early warning.
      The 90 percent alert tells you to stop trading immediately.
    </p>

    <h2>Step 5: Test Your Configuration</h2>
    <p>
      Before relying on Risk Guardian with live trades, verify your
      configuration is working correctly. Open a small position and confirm
      that the exposure is reflected in the dashboard. Check that alerts
      fire at the correct thresholds by temporarily setting a very low limit
      and placing a trade that exceeds it.
    </p>
  </>
)

const tutorial4Content = (
  <>
    <p>
      The ProStep2Market trade journal is more than a log. It is a structured
      reflection tool designed to identify behavioral patterns and drive
      improvement. This tutorial teaches you to use the journal's advanced
      features.
    </p>

    <h2>Creating Your First Entry</h2>
    <p>
      Navigate to Trades in the sidebar and click New Journal Entry. The
      journal template includes four sections: Setup, Execution, Emotional
      State, and Review. Each section includes structured prompts to guide
      your reflection.
    </p>

    <h2>The Setup Section</h2>
    <p>
      Record the market context: which instrument, what timeframe, what
      pattern you identified, and why you considered the trade. Use the
      screenshot tool to capture the chart at the moment of entry. This
      creates a visual record that you can review later alongside your notes.
    </p>

    <h2>The Execution Section</h2>
    <p>
      Record your exact entry price, stop loss, take profit, and position
      size. If you deviated from your plan — moved a stop, added to a
      position, closed early — record what you did and why. This section
      is where honesty matters most. Traders who minimize or omit their
      deviations from the journal deprive themselves of the most valuable
      data.
    </p>

    <h2>The Emotional State Section</h2>
    <p>
      Use the emotional slider to rate your state from calm to panicked on
      a 1 to 10 scale. Add notes about what you were feeling before, during,
      and after the trade. Over time, this data reveals correlations between
      emotional states and trade outcomes that are invisible in the raw P and L.
    </p>

    <h2>The Review Section</h2>
    <p>
      Answer the four review questions: Did I follow my rules? What did I do
      well? What did I do poorly? What will I do differently next time?
      These questions, answered consistently, are the engine of improvement.
    </p>

    <h2>Analyzing Journal Patterns</h2>
    <p>
      Navigate to Analytics then Journal Patterns to see aggregated insights
      from your journal entries. The system identifies patterns such as:
      you perform better in the morning, you overtrade on Fridays, your
      emotional state deteriorates after two consecutive losses. These
      patterns are invisible in individual entries but obvious in aggregate.
    </p>
  </>
)

const tutorial5Content = (
  <>
    <p>
      ProStep2Market's AI Trade Analysis uses machine learning to evaluate
      your trades against your historical patterns and provide actionable
      feedback. This tutorial shows you how to use this feature effectively.
    </p>

    <h2>What the AI Analyzes</h2>
    <p>
      The AI analysis evaluates each trade against multiple factors: your
      historical win rate for similar setups, your average hold time for
      comparable trades, your risk-reward execution versus your plan, your
      behavioral patterns in similar market conditions, and your compliance
      with your own stated rules.
    </p>

    <h2>Step 1: Enable AI Analysis</h2>
    <p>
      Navigate to Settings then AI Preferences and enable Trade Analysis.
      The AI needs at least 30 historical trades to produce meaningful
      analysis. If you have fewer than 30 trades, the AI will accumulate
      data and begin providing analysis once the threshold is reached.
    </p>

    <h2>Step 2: Request Analysis on a Trade</h2>
    <p>
      Open any trade in your journal and click Request AI Analysis. The
      system will analyze the trade and return a structured evaluation
      within a few seconds. The analysis includes an execution score from
      1 to 10, specific observations about what you did well and what
      could improve, and a comparison to your typical behavior on similar
      trades.
    </p>

    <h2>Step 3: Interpret the Results</h2>
    <p>
      Focus on the behavioral observations rather than whether the trade
      was profitable. A profitable trade with poor execution is more
      concerning than a losing trade with excellent execution. Over time,
      improving execution quality produces better results than focusing
      on individual trade outcomes.
    </p>

    <h2>Step 4: Track AI Insights Over Time</h2>
    <p>
      Navigate to Analytics then AI Insights to see aggregated feedback
      across all analyzed trades. The system identifies your most common
      behavioral patterns, your improvement trends, and areas that need
      continued focus. Review this page weekly to stay on track with your
      development goals.
    </p>
  </>
)

const tutorial6Content = (
  makeStub(
    "Learn to use the Strategy Lab visual builder to create, backtest, and refine trading strategies without writing code."
  )
)

const tutorial7Content = (
  makeStub(
    "Configure and manage multiple broker accounts in a unified ProStep2Market dashboard view."
  )
)

const tutorial8Content = (
  makeStub(
    "Create custom performance reports and export your trading data in various formats."
  )
)

const tutorial9Content = (
  makeStub(
    "For firm administrators: add traders to your team, assign roles, and configure permissions."
  )
)

const tutorial10Content = (
  makeStub(
    "Connect ProStep2Market data to your external tools using webhooks and the REST API."
  )
)

export const tutorialPosts: TutorialPost[] = [
  {
    title: "Connect Your MT4/MT5 Account",
    slug: "connect-mt4-mt5",
    category: "Setup",
    desc: "Step-by-step guide to linking your MetaTrader account for automatic trade sync.",
    difficulty: "Beginner",
    time: "5 min",
    author: "ProStep2Market Team",
    date: "Jul 8, 2026",
    content: tutorial1Content,
  },
  {
    title: "Complete Your Trader DNA Assessment",
    slug: "trader-dna-assessment",
    category: "Assessment",
    desc: "How to take the behavioral assessment and interpret your results.",
    difficulty: "Beginner",
    time: "15 min",
    author: "Dr. James Park",
    date: "Jul 4, 2026",
    content: tutorial2Content,
  },
  {
    title: "Set Up Your Risk Guardian Rules",
    slug: "risk-guardian-setup",
    category: "Risk",
    desc: "Configure personal risk parameters and alert thresholds.",
    difficulty: "Beginner",
    time: "10 min",
    author: "Alex Rivera",
    date: "Jun 30, 2026",
    content: tutorial3Content,
  },
  {
    title: "Master the Trade Journal",
    slug: "master-trade-journal",
    category: "Journal",
    desc: "Learn structured journaling techniques and how to use journal templates.",
    difficulty: "Intermediate",
    time: "20 min",
    author: "Emily Watson",
    date: "Jun 26, 2026",
    content: tutorial4Content,
  },
  {
    title: "Run Your First AI Trade Analysis",
    slug: "ai-trade-analysis",
    category: "AI",
    desc: "How to use the AI-powered trade review feature to analyze your trades.",
    difficulty: "Beginner",
    time: "8 min",
    author: "ProStep2Market Team",
    date: "Jun 22, 2026",
    content: tutorial5Content,
  },
  {
    title: "Build a Strategy in Strategy Lab",
    slug: "strategy-lab-intro",
    category: "Strategy",
    desc: "Create, backtest, and refine your first trading strategy using the visual builder.",
    difficulty: "Advanced",
    time: "30 min",
    author: "Marcus Johnson",
    date: "Jun 18, 2026",
    content: tutorial6Content,
  },
  {
    title: "Configure Multi-Account View",
    slug: "multi-account-view",
    category: "Setup",
    desc: "Set up and manage multiple broker accounts in a unified dashboard.",
    difficulty: "Intermediate",
    time: "10 min",
    author: "ProStep2Market Team",
    date: "Jun 14, 2026",
    content: tutorial7Content,
  },
  {
    title: "Generate and Export Performance Reports",
    slug: "performance-reports",
    category: "Analytics",
    desc: "Create custom reports and export your trading data.",
    difficulty: "Intermediate",
    time: "12 min",
    author: "ProStep2Market Team",
    date: "Jun 10, 2026",
    content: tutorial8Content,
  },
  {
    title: "Set Up Team Management",
    slug: "team-management",
    category: "Admin",
    desc: "For firm admins: add traders, assign roles, and configure permissions.",
    difficulty: "Advanced",
    time: "15 min",
    author: "Michael Torres",
    date: "Jun 6, 2026",
    content: tutorial9Content,
  },
  {
    title: "Integrate Webhooks and API",
    slug: "webhooks-api",
    category: "Developer",
    desc: "Connect ProStep2Market data to your external tools via webhooks.",
    difficulty: "Advanced",
    time: "25 min",
    author: "ProStep2Market Team",
    date: "Jun 2, 2026",
    content: tutorial10Content,
  },
]

export function getTutorialBySlug(slug: string): TutorialPost | undefined {
  return tutorialPosts.find((p) => p.slug === slug)
}

export function getAllTutorialSlugs(): string[] {
  return tutorialPosts.map((p) => p.slug)
}
