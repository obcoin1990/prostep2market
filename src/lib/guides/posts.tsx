import type { ReactNode } from "react"

export interface GuidePost {
  title: string
  slug: string
  category: string
  desc: string
  sections: number
  readTime: string
  level: string
  author: string
  date: string
  content: ReactNode
}

function makeStub(excerpt: string): ReactNode {
  return (
    <>
      <p>
        This guide is currently being expanded with full step-by-step content.
        Check back soon for the complete version. In the meantime, the overview
        below covers the key concepts you need to know.
      </p>
      <h2>Overview</h2>
      <p>{excerpt}</p>
      <p>
        ProStep2Market provides evidence-based tools and frameworks that help
        traders build discipline, manage risk, and develop a systematic edge.
        Each guide in this series is written by experienced traders and
        behavioral scientists to give you actionable, research-backed strategies.
      </p>
      <h2>What You Will Learn</h2>
      <ul>
        <li>The core psychological principles behind consistent trading</li>
        <li>Practical frameworks you can apply immediately</li>
        <li>How to use ProStep2Market tools to measure and track improvement</li>
        <li>Common mistakes and how to avoid them</li>
      </ul>
      <h2>Who This Guide Is For</h2>
      <p>
        Whether you are a beginner building your first trading plan or an
        experienced trader looking to refine your edge, these guides provide
        structured pathways to measurable improvement. Each guide includes
        exercises, worksheets, and links to platform features that support
        your development.
      </p>
    </>
  )
}

const guide1Content = (
  <>
    <p>
      Trading is often described as the hardest easy money you will ever make.
      The barrier to entry is low — anyone can open a brokerage account and
      place a trade within minutes. But the barrier to consistent profitability
      is extraordinarily high. Research consistently shows that 70 to 90 percent
      of retail traders lose money over time. The primary reason is not a lack
      of technical knowledge. It is a lack of psychological self-awareness and
      emotional discipline.
    </p>
    <p>
      This guide brings together decades of behavioral finance research,
      practical trading psychology, and the tools built into ProStep2Market
      to help you understand and master the mental side of trading. This is
      not about motivation or mindset platitudes. It is about understanding
      the specific psychological mechanisms that cause traders to fail and
      building systems that compensate for them.
    </p>

    <h2>Chapter 1: Why Psychology Matters More Than Strategy</h2>
    <p>
      Most traders spend the vast majority of their time searching for the
      perfect strategy. They backtest hundreds of indicators, optimize entry
      and exit rules, and chase the latest methodology promising consistent
      returns. Yet the evidence suggests that strategy selection accounts for
      only about 20 percent of trading success. The other 80 percent is
      execution — and execution is governed by psychology.
    </p>
    <p>
      Consider two traders using the identical strategy. One follows the rules
      consistently, takes every signal, manages risk properly, and reviews
      performance objectively. The other skips signals after losses, moves stop
      losses to avoid taking a hit, sizes up after wins, and avoids reviewing
      losing trades. The strategy is the same. The results will be dramatically
      different.
    </p>
    <p>
      Your Trader DNA profile identifies which psychological dimensions
      are strongest and weakest for you personally. Rather than generic advice,
      this gives you specific, targeted areas to focus on based on your own
      behavioral patterns.
    </p>

    <h2>Chapter 2: The Five Psychological Traps</h2>
    <p>
      Behavioral finance has identified five cognitive biases that account for
      the majority of trading losses. Understanding them is the foundation of
      psychological improvement.
    </p>
    <p>
      <strong>Loss Aversion.</strong> Kahneman and Tversky demonstrated that
      people feel losses roughly twice as intensely as equivalent gains. In
      trading, this means holding losing positions too long while cutting
      winners prematurely. The result is a portfolio that bleeds slowly from
      a thousand small cuts.
    </p>
    <p>
      <strong>Overconfidence Bias.</strong> After a winning streak, traders
      consistently overestimate their skill and underestimate randomness. This
      leads to oversized positions, skipped analysis, and ignored risk rules.
      The data is clear: traders who increase position size after consecutive
      wins almost always give back those gains.
    </p>
    <p>
      <strong>Disposition Effect.</strong> This is loss aversion applied to
      selling decisions. Retail traders realize gains at roughly 1.5 times
      their rate of realizing losses. This creates a portfolio structure that
      maximizes small wins and maximizes large losses — the opposite of what
      produces profitability.
    </p>
    <p>
      <strong>Recency Bias.</strong> The most recent trade feels like the most
      representative. After losses, the market seems more dangerous. After
      wins, it seems safer. This distortion causes traders to reduce exposure
      after drawdowns and increase exposure after gains — systematically buying
      high and selling low.
    </p>
    <p>
      <strong>Anchoring.</strong> Traders fixate on arbitrary reference points —
      entry price, account balance last week, a daily P and L target. These
      anchors distort decisions because they have no relationship to current
      market conditions or objective risk assessment.
    </p>

    <h2>Chapter 3: Building Self-Awareness</h2>
    <p>
      The first step to improving your trading psychology is understanding your
      own behavioral patterns. This is what the Trader DNA assessment is
      designed to do. Unlike generic personality tests, it measures behavioral
      tendencies specifically in trading contexts — how you handle drawdowns,
      whether you overtrade, how you manage position sizing, and how you
      respond to winning and losing streaks.
    </p>
    <p>
      The five dimensions measured — Risk Tolerance, Discipline, Emotional
      Resilience, Analytical Thinking, and Adaptability — each contain four
      sub-dimensions that give you a granular view of your behavioral profile.
      Most traders are strong in two or three dimensions and weak in one or two.
      The weak dimensions are where your money is lost.
    </p>

    <h2>Chapter 4: From Awareness to Rules</h2>
    <p>
      Awareness without action is useless. Once you understand your psychological
      profile, you need to build specific rules that compensate for your weak
      areas. These rules should be:
    </p>
    <ul>
      <li><strong>Explicit.</strong> Written down and specific. "Trade smaller" is not a rule. "Risk no more than 0.5 percent per trade" is.</li>
      <li><strong>Automated where possible.</strong> Use Risk Guardian to enforce position limits, drawdown stops, and daily loss limits automatically.</li>
      <li><strong>Measurable.</strong> Track compliance as a metric. Your Edge Score includes rule adherence as a factor.</li>
      <li><strong>Reviewed regularly.</strong> Set a weekly review to examine rule compliance and adjust where needed.</li>
    </ul>

    <h2>Chapter 5: The Role of Routine</h2>
    <p>
      Professional traders treat trading as a job, not a gamble. They have
      structured routines for pre-market preparation, trade execution, and
      post-market review. This structure is not about rigidity. It is about
      reducing the number of decisions you make in real-time, when emotions
      are highest and cognitive resources are lowest.
    </p>
    <p>
      Build a pre-trade routine that includes checking your risk limits,
      reviewing your current positions, identifying key levels for the day,
      and mentally preparing for the possibility of losses. Build a post-trade
      routine that includes journaling every trade, reviewing rule compliance,
      and noting emotional states. These routines compound over time into
      measurable improvement.
    </p>

    <h2>Chapter 6: Using ProStep2Market for Psychological Improvement</h2>
    <p>
      ProStep2Market provides several tools specifically designed to support
      psychological improvement. The Trader DNA assessment gives you your
      behavioral baseline. The Edge Score tracks consistency over time. Risk
      Guardian enforces rules automatically so you do not have to rely on
      willpower. The trade journal provides structured prompts to improve
      self-reflection. And the education platform delivers targeted content
      based on your specific weak areas.
    </p>
    <p>
      The key is to use these tools as an integrated system, not in isolation.
      Take the assessment, identify your weak dimensions, build rules to
      compensate, use Risk Guardian to enforce them, journal your trades to
      track compliance, and review your Edge Score to measure improvement.
      This closed loop is how traders make lasting, measurable progress.
    </p>
  </>
)

function makeGuide1(): ReactNode {
  return guide1Content
}

function makeGuide2(): ReactNode {
  return (
    <>
      <p>
        Risk management is the single most important factor separating
        consistently profitable traders from those who blow up. Yet most
        traders treat risk management as an afterthought — a stop loss placed
        arbitrarily, a position size guessed rather than calculated, a daily
        loss limit set and then ignored. This guide presents a complete,
        systematic risk management framework built on behavioral science and
        designed to work with the tools available in ProStep2Market.
      </p>

      <h2>The Core Principle: Survival First</h2>
      <p>
        The purpose of risk management is not to maximize returns. It is to
        ensure survival. A trader who risks too much per trade will eventually
        hit a losing streak large enough to wipe out their account, regardless
        of their edge. The math is unforgiving: a 50 percent drawdown requires
        a 100 percent gain just to break even. A 90 percent drawdown requires
        a 900 percent gain.
      </p>
      <p>
        The framework in this guide is built around a simple hierarchy: protect
        capital first, maintain consistency second, optimize returns third.
        Every rule in the system serves the first goal before it serves the
        second or third.
      </p>

      <h2>Rule 1: The 1 Percent Rule</h2>
      <p>
        Never risk more than 1 percent of your account on a single trade. For
        most traders, 0.5 percent is more appropriate until they have
        demonstrated consistent profitability. This rule alone prevents the
        catastrophic drawdowns that end trading careers.
      </p>
      <p>
        Calculate position size backwards from your stop loss distance and your
        maximum risk per trade. If your stop is 50 pips and your maximum risk
        is 0.5 percent of a $10,000 account ($50), your position size is 1
        standard lot. If the trade does not fit within your risk parameters,
        you do not take it. Period.
      </p>

      <h2>Rule 2: Daily Loss Limits</h2>
      <p>
        Set a maximum daily loss of 2 percent. If you hit it, you stop trading
        for the day. This rule is not about the money. It is about preventing
        the emotional spiral that leads to revenge trading and compounding
        losses. When you are down 2 percent in a day, your cognitive function
        is measurably impaired. Continuing to trade is statistically worse
        than stopping.
      </p>
      <p>
        Risk Guardian in ProStep2Market can enforce this rule automatically.
        Configure your daily loss limit and the system will lock you out of new
        positions once the threshold is reached.
      </p>

      <h2>Rule 3: Weekly and Monthly Drawdown Limits</h2>
      <p>
        Set a maximum weekly drawdown of 5 percent and a maximum monthly
        drawdown of 10 percent. These limits provide a circuit breaker for
        extended losing periods. If either limit is hit, stop trading and
        conduct a full review before resuming.
      </p>

      <h2>Rule 4: Position Correlation</h2>
      <p>
        Do not hold more than three correlated positions simultaneously. If
        you are long EUR/USD and long GBP/USD, you are effectively doubling
        your exposure to USD weakness. Correlated positions amplify drawdowns
        and create the illusion of diversification where none exists.
      </p>

      <h2>Rule 5: Risk-Reward Minimum</h2>
      <p>
        Only take trades where the potential reward is at least twice the
        potential risk. A 2:1 minimum risk-reward ratio means you can be wrong
        60 percent of the time and still break even. This removes the
        pressure to be right and shifts your focus to the quality of each
        individual trade setup.
      </p>

      <h2>Implementing the Framework</h2>
      <p>
        Write down every rule. Configure Risk Guardian to enforce the automated
        rules. Track compliance in your trade journal. Review compliance weekly.
        Adjust the specific numbers to match your account size and trading
        style, but never compromise on the principles.
      </p>
    </>
  )
}

function makeGuide3(): ReactNode {
  return (
    <>
      <p>
        A trading journal is one of the most powerful tools for improvement,
        yet most traders either do not keep one or keep one that provides no
        actionable insight. A journal that only records entry price, exit
        price, and P and L is a scorecard, not a development tool. This guide
        teaches you how to build a journaling system that actually drives
        improvement in your trading performance.
      </p>

      <h2>Why Most Journals Fail</h2>
      <p>
        The most common journal failure is recording without reflection. Traders
        log their trades at the end of the day and never look at them again.
        The journal becomes a graveyard of data rather than a source of insight.
        The second most common failure is inconsistent use. Traders journal
        their winning trades and skip the losing ones, creating a dataset that
        is both incomplete and biased.
      </p>

      <h2>The Four-Part Journal Structure</h2>
      <p>
        Every journal entry should contain four sections: Setup, Execution,
        Emotional State, and Review. The Setup section records the objective
        conditions that justified the trade — the pattern, the levels, the
        timeframe, the confluence factors. The Execution section records what
        you actually did — entry, exit, stop loss, take profit, and any
        deviations from your plan. The Emotional State section records how you
        felt before, during, and after the trade. The Review section records
        what you learned.
      </p>

      <h2>Pre-Trade Journaling</h2>
      <p>
        Before entering a trade, write down your thesis in one sentence. What
        do you expect to happen and why? Write down your stop loss level and
        the reason for that specific level. Write down your target and the
        reason for that specific level. Record your confidence level on a 1
        to 10 scale. This pre-trade process forces clarity and creates a
        baseline for objective review.
      </p>

      <h2>Post-Trade Review</h2>
      <p>
        After closing a trade, answer four questions: Did I follow my rules?
        What did I do well? What did I do poorly? What will I do differently
        next time? These four questions, answered honestly and consistently,
        will reveal patterns in your behavior that no technical indicator
        can show you.
      </p>

      <h2>Weekly Performance Review</h2>
      <p>
        Every week, review all your trades as a group. Look for patterns: Are
        you more disciplined on certain days? Do you overtrade in certain
        market conditions? Are you cutting winners early or holding losers
        too long? Calculate your rule compliance rate and track it over time.
        This is how you turn raw data into behavioral improvement.
      </p>

      <h2>Using ProStep2Market Journals</h2>
      <p>
        The ProStep2Market trade journal includes structured templates for
        each of these sections, automated P and L tracking, emotional state
        prompts, and pattern recognition that identifies your behavioral
        tendencies across dozens of trades. Use the templates as a starting
        point and customize them to match your trading style.
      </p>
    </>
  )
}

function makeGuide4(): ReactNode {
  return (
    <>
      <p>
        Your Edge Score is ProStep2Market's proprietary metric that measures
        your overall trading consistency across 12 factors. Unlike raw P and L,
        which tells you how much money you made, the Edge Score tells you how
        likely you are to continue making money. A high Edge Score indicates
        disciplined, systematic behavior. A low Edge Score indicates the
        behavioral patterns that precede account blowups.
      </p>

      <h2>The 12 Factors</h2>
      <p>
        The Edge Score is computed from 12 measurable behavioral factors:
        rule adherence, position sizing consistency, risk-reward management,
        emotional stability, trade frequency, session discipline, stop loss
        compliance, take profit discipline, drawdown recovery, win rate
        stability, average holding period, and time-of-day consistency. Each
        factor is scored on a 0 to 100 scale and weighted based on its
        statistical correlation with long-term profitability.
      </p>

      <h2>How to Improve Each Factor</h2>
      <p>
        <strong>Rule Adherence.</strong> This is the single most predictive
        factor. Track every rule you set and calculate your compliance rate.
        A compliance rate above 90 percent correlates strongly with positive
        long-term results. Use Risk Guardian to automate rules where possible.
      </p>
      <p>
        <strong>Position Sizing Consistency.</strong> Traders who vary their
        risk per trade randomly produce inconsistent results regardless of
        their win rate. Set a fixed risk percentage and stick to it until you
        have at least 100 trades of data.
      </p>
      <p>
        <strong>Stop Loss Compliance.</strong> Moving or removing stop losses
        is the most damaging behavior in retail trading. If your stop loss
        compliance rate is below 80 percent, this is your number one priority.
      </p>

      <h2>Reading Your Score Over Time</h2>
      <p>
        The absolute value of your Edge Score matters less than the trend. A
        trader whose score improves from 45 to 65 over three months is on a
        strong trajectory. A trader whose score drops from 70 to 60 is
        deteriorating despite potentially still being profitable. Focus on
        the trend, not the number.
      </p>
    </>
  )
}

function makeGuide5(): ReactNode {
  return (
    <>
      <p>
        Trader DNA is ProStep2Market's behavioral assessment system. It measures
        16 sub-dimensions across 5 core dimensions of trading psychology,
        producing a unique behavioral profile for each trader. This guide is a
        complete reference for understanding what each dimension measures, what
        high and low scores indicate, and how to use the information to improve
        your trading.
      </p>

      <h2>The Five Core Dimensions</h2>
      <p>
        <strong>Risk Tolerance.</strong> Measures how you approach and manage
        financial risk. Sub-dimensions: Risk Perception (how you evaluate
        probability), Position Sizing (how you determine trade size), Loss
        Processing (how you emotionally handle losses), and Uncertainty
        Comfort (how you perform in ambiguous market conditions).
      </p>
      <p>
        <strong>Discipline.</strong> Measures your ability to follow rules and
        maintain consistency. Sub-dimensions: Rule Adherence (how consistently
        you follow your own rules), Plan Execution (how well you stick to your
        trading plan), Patience (how you handle waiting for setups), and
        Impulse Control (how you manage the urge to overtrade).
      </p>
      <p>
        <strong>Emotional Resilience.</strong> Measures how you handle the
        emotional demands of trading. Sub-dimensions: Stress Response (your
        physiological reaction to losing), Recovery Speed (how quickly you
        return to baseline after a loss), Confidence Stability (how stable
        your confidence remains across winning and losing periods), and
        Emotional Awareness (how well you recognize your own emotional states).
      </p>
      <p>
        <strong>Analytical Thinking.</strong> Measures your cognitive approach
        to market analysis. Sub-dimensions: Pattern Recognition (how quickly
        you identify setups), Decision Speed (how efficiently you process
        information), Information Filtering (how well you ignore noise), and
        Objective Assessment (how accurately you evaluate your own performance).
      </p>
      <p>
        <strong>Adaptability.</strong> Measures how well you adjust to changing
        market conditions. Sub-dimensions: Regime Recognition (how quickly you
        identify when the market has changed), Strategy Flexibility (how willing
        you are to adjust your approach), Learning Speed (how quickly you
        incorporate new information), and Innovation (how well you generate
        new ideas).
      </p>

      <h2>Interpreting Your Profile</h2>
      <p>
        Each dimension is scored on a scale from 1 to 100. High scores are
        not inherently better than low scores. A trader with high Risk
        Tolerance and low Discipline may perform well in trending markets but
        blow up in ranging conditions. The ideal profile depends on your
        trading style, your market, and your experience level. The key insight
        is identifying which dimensions are dragging your performance and
        building targeted improvement plans for those specific areas.
      </p>
    </>
  )
}

function makeGuide6(): ReactNode {
  return (
    <>
      <p>
        Developing a profitable trading strategy is a systematic process that
        combines hypothesis generation, rigorous testing, and disciplined
        implementation. Most traders skip the middle step — they go from idea
        to live trading without sufficient testing. This guide walks through
        the complete process from initial idea to live implementation, using
        the Strategy Lab in ProStep2Market as the development and testing
        environment.
      </p>

      <h2>Step 1: Define Your Edge Hypothesis</h2>
      <p>
        Every strategy begins with a hypothesis about what works in the market
        and why. The hypothesis should be specific, testable, and grounded in
        a logical mechanism. "Moving average crossovers work" is not a useful
        hypothesis. "When the 20-period EMA crosses above the 50-period EMA
        on the daily chart during an uptrend in the 200-period EMA, price
        continues higher more than 60 percent of the time over the next 10
        bars" is.
      </p>

      <h2>Step 2: Define Entry and Exit Rules</h2>
      <p>
        Translate your hypothesis into specific, unambiguous rules. Every trade
        signal must be objectively identifiable. If you cannot look at a chart
        and definitively say whether a signal occurred, your rules are not
        specific enough. Define your entry trigger, your stop loss placement,
        your initial profit target, and your trailing stop method.
      </p>

      <h2>Step 3: Backtest with Realistic Assumptions</h2>
      <p>
        Use the Strategy Lab to backtest your rules on historical data. Pay
        attention to slippage, commissions, and spread assumptions. Most
        backtests are overly optimistic because they ignore these real-world
        costs. Test across at least two years of data and multiple market
        regimes. A strategy that works in trending markets but fails in ranging
        markets is not robust.
      </p>

      <h2>Step 4: Analyze the Results</h2>
      <p>
        Look beyond net profit. Examine maximum drawdown, profit factor, win
        rate, average win versus average loss, and the distribution of trade
        results. A strategy with a 45 percent win rate and a 3:1 reward-to-risk
        ratio is far more robust than one with a 70 percent win rate and a
        0.5:1 ratio, even if the total profit is similar.
      </p>

      <h2>Step 5: Forward Test</h2>
      <p>
        Before risking real money, trade the strategy in a demo account for at
        least 50 trades. This tests both the strategy and your ability to
        execute it. If you cannot follow the rules consistently in demo, you
        will not do it with real money at stake.
      </p>

      <h2>Step 6: Go Live with Minimum Size</h2>
      <p>
        Start live trading with the smallest possible position size. The
        goal of this phase is not to make money. It is to validate that your
        execution matches your backtest assumptions and that you can maintain
        psychological composure with real money at risk. Increase size only
        after you have at least 30 live trades that match your backtest
        performance characteristics.
      </p>
    </>
  )
}

function makeGuide7(): ReactNode {
  return (
    <>
      <p>
        Every trader takes bad risks. It is a fundamental part of human
        psychology — we are wired to underestimate rare events, overestimate
        our ability to control outcomes, and seek reward while ignoring danger.
        The difference between traders who survive and those who do not is
        not that survivors avoid bad risks entirely. It is that they recognize
        when they are taking them and have systems in place to limit the damage.
      </p>

      <h2>Why We Take Bad Risks</h2>
      <p>
        The neurochemistry of risk-taking is well understood. Uncertain rewards
        trigger dopamine release in the same brain circuits activated by
        addictive substances. The more uncertain the reward, the more dopamine
        is released. This is why gambling is addictive and why traders
        consistently take positions that are too large, hold trades too long,
        and chase breakouts that have already moved.
      </p>
      <p>
        The problem is compounded by cognitive biases. The availability
        heuristic makes recent wins feel more likely to repeat. Optimism bias
        makes us underestimate the probability of loss. And the illusion of
        control makes us believe our analysis gives us power over outcomes that
        are fundamentally uncertain.
      </p>

      <h2>The Three Types of Bad Risk</h2>
      <p>
        <strong>Position risk.</strong> Risking too much on a single trade.
        This is the most common and most damaging form. A single oversized
        loss can wipe out weeks of gains.
      </p>
      <p>
        <strong>Emotional risk.</strong> Taking trades based on emotional state
        rather than objective criteria. Revenge trading after a loss, FOMO
        entries after a missed move, and boredom trades during quiet markets
        all fall into this category.
      </p>
      <p>
        <strong>Correlation risk.</strong> Holding multiple positions that are
        correlated in the same direction. This creates concentrated exposure
        that looks diversified but is not.
      </p>

      <h2>Building a System That Compensates</h2>
      <p>
        The solution is not willpower. Willpower is a depletable resource that
        fails precisely when you need it most — during emotional states. The
        solution is a system of automated rules, pre-committed constraints,
        and regular review. Risk Guardian enforces position limits. Pre-trade
        checklists prevent emotional entries. And weekly reviews identify
        patterns before they become problems.
      </p>
    </>
  )
}

function makeGuide8(): ReactNode {
  return (
    <>
      <p>
        Trading discipline is not a personality trait. It is a skill that can
        be built through deliberate practice. This 90-day program uses
        behavioral science principles to help you develop lasting discipline
        in your trading. Each phase builds on the previous one, creating
        sustainable habits rather than temporary motivation.
      </p>

      <h2>Days 1-30: Foundation Phase</h2>
      <p>
        The first month focuses on establishing basic routines and measuring
        your baseline behavior. Complete your Trader DNA assessment. Set up
        Risk Guardian with conservative parameters. Begin journaling every
        trade with the four-part structure. Record your emotional state before
        each trade. Track your rule compliance rate daily. Do not try to
        improve yet — just measure.
      </p>
      <p>
        At the end of the first month, calculate your baseline metrics: rule
        compliance rate, average emotional state, number of impulsive trades,
        and your Edge Score. These numbers are your starting point. They are
        not judgments. They are data.
      </p>

      <h2>Days 31-60: Targeted Improvement Phase</h2>
      <p>
        Using your Trader DNA results and your baseline data, identify the one
        behavioral pattern that is costing you the most. Focus exclusively on
        this one area for the entire second month. If your biggest problem is
        overtrading, set a maximum trade count and enforce it. If it is moving
        stop losses, configure Risk Guardian to make stops unmovable. If it is
        oversized positions, cut your maximum risk in half.
      </p>
      <p>
        The key principle is focus. Trying to fix everything at once fixes
        nothing. Pick the single most impactful behavior and change it
        completely before moving to the next.
      </p>

      <h2>Days 61-90: Integration Phase</h2>
      <p>
        In the final month, maintain the improvement from phase two while
        adding a second behavioral focus. Review your weekly metrics to ensure
        the first improvement has stuck. Begin tracking your performance
        relative to your strategy's expected value. Compare your baseline
        metrics from month one to your current metrics. Calculate the
        improvement in rule compliance, emotional stability, and Edge Score.
      </p>
      <p>
        At the end of 90 days, you will have measurable evidence of
        improvement — or evidence that you need to adjust your approach. Either
        outcome is valuable. The worst outcome is no data at all.
      </p>
    </>
  )
}

function makeGuide9(): ReactNode {
  return (
    <>
      <p>
        ProStep2Market generates over 40 performance metrics. Most traders
        look at two: total P and L and win rate. This guide teaches you to
        read the metrics that actually predict future performance and to
        identify the early warning signs that precede drawdowns.
      </p>

      <h2>The Metrics That Matter</h2>
      <p>
        <strong>Profit Factor.</strong> Gross profits divided by gross losses.
        A profit factor above 1.5 indicates a positive expectancy. Below 1.0
        indicates a negative expectancy. Track this weekly and monthly.
      </p>
      <p>
        <strong>Maximum Drawdown.</strong> The largest peak-to-trough decline
        in your account. This is the most important risk metric. If your
        maximum drawdown exceeds your plan, you are trading too aggressively.
      </p>
      <p>
        <strong>Rule Compliance Rate.</strong> The percentage of trades where
        you followed all your rules. This is the most predictive metric for
        future performance. A declining compliance rate almost always precedes
        a drawdown.
      </p>

      <h2>Early Warning Signals</h2>
      <p>
        Watch for these patterns: increasing trade frequency, decreasing
        average holding period, increasing position size relative to account
        equity, declining rule compliance, and increasing emotional volatility
        in your journal entries. Any two of these appearing simultaneously is
        a strong signal to reduce exposure and conduct a full review.
      </p>

      <h2>Building a Dashboard</h2>
      <p>
        Configure your ProStep2Market dashboard to display your five most
        important metrics prominently. Review them at the start of every
        trading session. Set alerts for when any metric crosses a threshold.
        This creates a feedback loop that catches problems early.
      </p>
    </>
  )
}

function makeGuide10(): ReactNode {
  return (
    <>
      <p>
        Passing a prop firm evaluation requires more than a good strategy. It
        requires understanding the specific rules, managing your psychology
        under evaluation pressure, and building a systematic approach to
        meeting the targets without violating the constraints. This guide
        covers everything you need to know to prepare for and pass prop firm
        trading evaluations.
      </p>

      <h2>Understanding Prop Firm Rules</h2>
      <p>
        Most prop firm evaluations have three components: a profit target, a
        maximum drawdown limit, and a minimum number of trading days. Some
        firms add consistency rules, maximum daily loss limits, and time-based
        constraints. Understand every rule completely before you begin. A
        single violation — even on a profitable day — can disqualify your
        evaluation.
      </p>

      <h2>The Conservative Approach</h2>
      <p>
        The biggest mistake evaluation traders make is trading too aggressively
        to hit the profit target quickly. This dramatically increases the
        probability of hitting the drawdown limit. The optimal approach is
        conservative: risk 0.25 to 0.5 percent per trade, take only A-plus
        setups, and let the profit accumulate gradually over the required
        number of days.
      </p>

      <h2>Managing Evaluation Psychology</h2>
      <p>
        The pressure of an evaluation creates unique psychological challenges.
        The profit target creates urgency. The drawdown limit creates fear.
        These opposing forces produce exactly the emotional conditions that
        lead to poor decisions: overtrading, moved stops, oversized positions,
        and revenge trading.
      </p>
      <p>
        The solution is to treat the evaluation as if it were a live account
        with the same rules. Use Risk Guardian with the firm's exact
        parameters as your limits. Journal every trade. Focus on process, not
        outcome. The traders who pass evaluations are the ones who trade their
        normal strategy with normal risk. The traders who fail are the ones
        who try to be heroes.
      </p>

      <h2>Preparation Timeline</h2>
      <p>
        Begin preparation at least 30 days before your evaluation. Complete
        your Trader DNA assessment to identify your weak areas. Backtest your
        strategy on the instruments you will be trading. Forward test for at
        least 20 trading days. Simulate the evaluation conditions — same risk
        parameters, same instruments, same time frames. If you can pass a
        simulated evaluation, you are ready for the real one.
      </p>
    </>
  )
}

export const guidePosts: GuidePost[] = [
  {
    title: "The Complete Guide to Trading Psychology",
    slug: "trading-psychology",
    category: "Trading Psychology",
    desc: "Master the mental game of trading with evidence-based psychological techniques.",
    sections: 12,
    readTime: "45 min",
    level: "Beginner",
    author: "Dr. Sarah Chen",
    date: "Jul 10, 2026",
    content: makeGuide1(),
  },
  {
    title: "Risk Management Framework for Consistent Traders",
    slug: "risk-management-framework",
    category: "Risk Management",
    desc: "Build a comprehensive risk management system that protects your capital and maximizes returns.",
    sections: 8,
    readTime: "30 min",
    level: "Intermediate",
    author: "Alex Rivera",
    date: "Jul 6, 2026",
    content: makeGuide2(),
  },
  {
    title: "How to Build a Trading Journal That Actually Improves Performance",
    slug: "trading-journal-performance",
    category: "Journaling",
    desc: "Transform your trade journal from a simple log into a powerful improvement tool.",
    sections: 10,
    readTime: "35 min",
    level: "All Levels",
    author: "Emily Watson",
    date: "Jul 2, 2026",
    content: makeGuide3(),
  },
  {
    title: "Understanding and Improving Your Edge Score",
    slug: "edge-score-deep-dive",
    category: "Platform",
    desc: "Deep dive into the 12 factors that determine your Edge Score and how to improve each one.",
    sections: 6,
    readTime: "25 min",
    level: "Intermediate",
    author: "ProStep2Market Team",
    date: "Jun 28, 2026",
    content: makeGuide4(),
  },
  {
    title: "Trader DNA: A Complete Reference to Your 16 Behavioral Dimensions",
    slug: "trader-dna-reference",
    category: "Assessment",
    desc: "Comprehensive reference for understanding each dimension of your Trader DNA profile.",
    sections: 16,
    readTime: "60 min",
    level: "All Levels",
    author: "Dr. James Park",
    date: "Jun 24, 2026",
    content: makeGuide5(),
  },
  {
    title: "Strategy Development: From Idea to Profitable System",
    slug: "strategy-development",
    category: "Strategy",
    desc: "A systematic approach to developing, testing, and implementing trading strategies.",
    sections: 14,
    readTime: "50 min",
    level: "Advanced",
    author: "Marcus Johnson",
    date: "Jun 20, 2026",
    content: makeGuide6(),
  },
  {
    title: "The Psychology of Risk: Why We Take Bad Risks and How to Stop",
    slug: "psychology-of-risk",
    category: "Trading Psychology",
    desc: "Understanding the cognitive biases that lead to poor risk decisions and how to overcome them.",
    sections: 9,
    readTime: "32 min",
    level: "Intermediate",
    author: "Dr. Sarah Chen",
    date: "Jun 16, 2026",
    content: makeGuide7(),
  },
  {
    title: "Building Trading Discipline: A 90-Day Program",
    slug: "90-day-discipline",
    category: "Development",
    desc: "A structured 90-day program to build lasting trading discipline using behavioral science.",
    sections: 12,
    readTime: "40 min",
    level: "All Levels",
    author: "Michael Torres",
    date: "Jun 12, 2026",
    content: makeGuide8(),
  },
  {
    title: "Advanced Analytics: Interpreting Your Performance Data",
    slug: "advanced-analytics",
    category: "Analytics",
    desc: "Learn to read and act on the 40+ performance metrics available in your dashboard.",
    sections: 7,
    readTime: "28 min",
    level: "Advanced",
    author: "ProStep2Market Team",
    date: "Jun 8, 2026",
    content: makeGuide9(),
  },
  {
    title: "Prop Firm Evaluation Preparation Guide",
    slug: "prop-firm-preparation",
    category: "Prop Firms",
    desc: "Everything you need to know to prepare for and pass prop firm trading evaluations.",
    sections: 11,
    readTime: "38 min",
    level: "Intermediate",
    author: "Alex Rivera",
    date: "Jun 4, 2026",
    content: makeGuide10(),
  },
]

export function getGuideBySlug(slug: string): GuidePost | undefined {
  return guidePosts.find((p) => p.slug === slug)
}

export function getAllGuideSlugs(): string[] {
  return guidePosts.map((p) => p.slug)
}
