export const metadata = {
  title: "Risk Disclaimer - ProStep2Market",
  description: "Risk Disclaimer for ProStep2Market trading performance platform",
};

export default function DisclaimerPage() {
  const sections = [
    {
      title: "1. Not Financial Advice",
      content:
        "ProStep2Market does not provide investment advice, financial advice, or trading signals. All content, tools, and resources on this platform are for educational and informational purposes only. The information provided should not be construed as financial advice or a recommendation to buy, sell, or hold any security.",
    },
    {
      title: "2. No Guarantees",
      content:
        "Past performance and historical data analysis do not guarantee future results. Any trading strategy, simulation, or analytics tool available on this platform is based on historical data and mathematical models, which may not accurately predict future market behavior. Your trading results may vary significantly from any past performance.",
    },
    {
      title: "3. Trading Risks",
      content:
        "Trading Forex, CFDs, and other financial instruments involves substantial risk of loss and may not be suitable for all investors. The leverage involved in trading can work against you as well as for you. You could lose some or all of your invested capital. Only trade with money you can afford to lose.",
    },
    {
      title: "4. User Responsibility",
      content:
        "You are solely responsible for all trading decisions, including entry and exit points, position sizing, and risk management. ProStep2Market provides tools to help you analyze your trading, but the final decision to execute any trade is yours alone. You should consult with a qualified financial advisor before making investment decisions.",
    },
    {
      title: "5. Third-Party Links",
      content:
        "Our platform may contain links to third-party websites, services, or resources. We are not responsible for the content, accuracy, or practices of these third-party sites. Inclusion of links does not imply endorsement by ProStep2Market. Your use of third-party sites is at your own risk.",
    },
    {
      title: "6. Simulator Disclaimer",
      content:
        "The Strategy Lab simulation feature is for educational and analytical purposes only. Simulations use mathematical models and historical data to estimate potential outcomes. These simulations do not account for slippage, market impact, or execution delays that occur in live trading. Simulated results may differ significantly from actual trading results.",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Risk Disclaimer
      </h1>
      <p className="text-gray-500 mb-8">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
        <p className="text-amber-800 text-sm">
          <strong>Important:</strong> Trading involves significant risk. You may lose your entire investment.
          ProStep2Market is a tool for tracking and analyzing your trading performance, not a financial advisor.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">{section.content}</p>
          </section>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>
          If you have questions about this disclaimer, please contact us at{" "}
          <a href="mailto:support@prostep2market.com" className="text-[#E53935] hover:underline">
            support@prostep2market.com
          </a>
        </p>
      </div>
    </div>
  );
}