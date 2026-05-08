export const metadata = {
  title: "Terms of Service - ProStep2Market",
  description: "Terms of Service for ProStep2Market trading performance platform",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using ProStep2Market, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.",
    },
    {
      title: "2. Description of Service",
      content:
        "ProStep2Market is a trading performance and behavioral analytics platform designed to help traders track, analyze, and improve their trading discipline. The platform provides tools for journal management, strategy simulation, performance tracking, and educational resources.",
    },
    {
      title: "3. User Accounts",
      content:
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account and to update your information as necessary. You must be at least 18 years old to create an account.",
    },
    {
      title: "4. Prohibited Uses",
      content:
        "You may not use the service to: (a) Provide trading signals or financial advice to other users; (b) Engage in any illegal activity or violate any applicable laws; (c) Attempt to gain unauthorized access to any part of the platform; (d) Interfere with or disrupt the platform's operation; (e) Use the platform for any commercial purpose without authorization.",
    },
    {
      title: "5. Intellectual Property",
      content:
        "All content, features, and functionality of ProStep2Market are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our platform without prior written consent.",
    },
    {
      title: "6. Limitation of Liability",
      content:
        "ProStep2Market shall not be liable for any trading losses, financial losses, or damages arising from your use of the platform. We provide analytics and tools for educational purposes only, and any trading decisions you make are solely your responsibility. Past performance does not guarantee future results.",
    },
    {
      title: "7. Disclaimer",
      content:
        "ProStep2Market is not a registered investment advisor, broker-dealer, or financial analyst. We do not provide investment advice, financial advice, or trading signals. All content on the platform is for educational and informational purposes only. You should consult with a qualified financial advisor before making any investment decisions.",
    },
    {
      title: "8. Governing Law",
      content:
        "These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ProStep2Market operates. Any disputes arising from these terms shall be resolved through binding arbitration in accordance with applicable arbitration rules.",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Terms of Service
      </h1>
      <p className="text-gray-500 mb-8">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

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
          If you have questions about these Terms of Service, please contact us at{" "}
          <a href="mailto:support@prostep2market.com" className="text-[#E53935] hover:underline">
            support@prostep2market.com
          </a>
        </p>
      </div>
    </div>
  );
}