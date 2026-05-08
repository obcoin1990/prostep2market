import { FAQAccordion } from "@/components/faq/FAQAccordion"

const faqItems = [
  {
    question: "What does ProStep2Market do?",
    answer:
      "ProStep2Market analyzes your trading behavior and performance to help you understand your strengths and weaknesses. Our AI identifies patterns in your trades, measures your discipline, and provides personalized insights to improve your trading habits.",
  },
  {
    question: "Do you provide trading signals?",
    answer:
      "No, ProStep2Market does not provide trading signals, copy trading services, or financial advice. We focus on behavioral analysis and self-improvement tools. We believe the best trader is a disciplined trader, not one who follows others.",
  },
  {
    question: "How do I connect my account?",
    answer:
      "You can connect your MetaTrader 5 (MT5) account using a read-only connection, or import your trading history via CSV file. Read-only access means we can only view your trades - we cannot execute any actions on your account.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, your data security is our top priority. All data is encrypted in transit using industry-standard TLS encryption and encrypted at rest. We never share your trading data with third parties, and you can delete your data at any time.",
  },
  {
    question: "Can I use the platform without connecting MT5?",
    answer:
      "Yes, you can use ProStep2Market without connecting to MT5. You can manually enter trades or import your trading history via CSV file. This allows you to benefit from our analytics and AI insights regardless of your broker or platform.",
  },
  {
    question: "What is Edge Score?",
    answer:
      "Edge Score is our gamified performance metric that measures your trading discipline across four pillars: discipline (risk management), risk (position sizing), emotional stability (consistency), and execution (trade quality). A higher score indicates better trading habits and a stronger edge in the markets.",
  },
  {
    question: "Can brokers use this platform?",
    answer:
      "Yes, we offer an Enterprise plan specifically designed for brokers and trading firms. This includes white label customization, custom integrations with your existing systems, dedicated support, and compliance-ready reporting. Contact us for custom pricing.",
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0B0B0B] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg">
            Find answers to common questions about ProStep2Market
          </p>
        </div>

        <FAQAccordion items={faqItems} />
      </div>
    </div>
  )
}
