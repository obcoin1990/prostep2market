'use client'

export default function TraderDNAAssessment() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-[#eaecef]">Complete Your Trader DNA Assessment</h1>
        <p className="text-[#aeaeae] max-w-2xl">
          The Trader DNA Assessment is a psychological profiling tool that analyzes your trading personality,
          risk tolerance, emotional triggers, and decision-making patterns. Use the results to tailor your
          trading approach and identify blind spots.
        </p>
      </div>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 text-sm text-[#eaecef]">
        <strong>What is Trader DNA?</strong> It is a comprehensive evaluation that combines personality
        traits, cognitive biases, and past trade data to generate a personalized trader profile. Your DNA
        evolves over time as you log more trades.
      </div>

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">1. Start the Assessment</h2>
          <p className="text-[#aeaeae]">
            Go to <strong>Trader DNA</strong> from the sidebar. Click <strong>Begin Assessment</strong> to
            launch the questionnaire. It takes approximately 10–15 minutes to complete.
          </p>
          <div className="bg-[#1e2329] border border-[#2b3139] rounded-lg p-4 font-mono text-sm text-[#aeaeae]">
            <div>/app/trader-dna/assessment</div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">2. Answer the Questions</h2>
          <p className="text-[#aeaeae]">
            The assessment consists of 40 multiple-choice questions across five categories: risk appetite,
            emotional regulation, discipline, analytical style, and reaction to loss. Answer honestly for the
            most accurate profile.
          </p>
          <div className="border border-[#2b3139] rounded-lg p-4 bg-[#1e2329] text-sm text-[#aeaeae]">
            <em>[Screenshot: Assessment question with Likert scale options]</em>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">3. Review Your Results</h2>
          <p className="text-[#aeaeae]">
            After submission, your Trader DNA profile is generated instantly. You will see scores for each
            category, a personality archetype (e.g., <strong>The Analyst</strong>, <strong>The Maverick</strong>),
            and personalized recommendations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#eaecef]">4. Apply the Insights</h2>
          <p className="text-[#aeaeae]">
            Use your DNA results to refine your trading plan. If your profile shows low emotional regulation,
            focus on position size limits. If high risk appetite, consider adding extra confirmation filters
            before entering trades.
          </p>
        </section>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-[#eaecef]">Scoring Explanation</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-[#aeaeae] border-collapse">
            <thead>
              <tr className="border-b border-[#2b3139]">
                <th className="text-left py-2 pr-4 font-medium text-[#eaecef]">Category</th>
                <th className="text-left py-2 pr-4 font-medium text-[#eaecef]">Low (0–3)</th>
                <th className="text-left py-2 font-medium text-[#eaecef]">High (7–10)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#2b3139]">
                <td className="py-2 pr-4">Risk Appetite</td>
                <td className="py-2 pr-4">Cautious, capital preservation</td>
                <td className="py-2">Aggressive, seeks high returns</td>
              </tr>
              <tr className="border-b border-[#2b3139]">
                <td className="py-2 pr-4">Emotional Regulation</td>
                <td className="py-2 pr-4">Easily affected by losses</td>
                <td className="py-2">Stoic, consistent decision-making</td>
              </tr>
              <tr className="border-b border-[#2b3139]">
                <td className="py-2 pr-4">Discipline</td>
                <td className="py-2 pr-4">Often deviates from plan</td>
                <td className="py-2">Follows rules religiously</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Analytical Style</td>
                <td className="py-2 pr-4">Gut-feel, intuition driven</td>
                <td className="py-2">Data-heavy, systematic</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-[#eaecef]">Next Steps</h2>
        <ul className="space-y-2 text-sm text-[#aeaeae] list-disc pl-5">
          <li>Re-take the assessment after 50 journaled trades to see how your DNA evolves.</li>
          <li>Compare your DNA profile with the recommended profiles for your preferred strategy.</li>
          <li>Use the personalized recommendations as a checklist for your trading routine.</li>
        </ul>
      </div>

      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 text-sm text-[#eaecef]">
        <strong>Tip:</strong> You can retake the assessment at any time. Your DNA updates dynamically as you
        log more trades — no second questionnaire needed for the behavioral dimensions.
      </div>
    </div>
  )
}
