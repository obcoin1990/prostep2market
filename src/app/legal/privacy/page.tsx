export const metadata = {
  title: "Privacy Policy - ProStep2Market",
  description: "Privacy Policy for ProStep2Market trading performance platform",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "We collect information you provide when creating an account (such as your name and email), trading data you import or enter manually, usage data including how you interact with the platform, and technical data such as device information and IP addresses.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "We use your information to provide and improve our services, personalize your experience, analyze your trading performance, communicate with you about your account, send you relevant updates and notifications, and maintain the security of our platform.",
    },
    {
      title: "3. Data Security",
      content:
        "We implement appropriate technical and organizational measures to protect your data, including encryption of data in transit and at rest, role-based access controls, regular security audits, and secure storage practices. While we strive to protect your information, no method of transmission over the internet is 100% secure.",
    },
    {
      title: "4. Data Sharing",
      content:
        "We do not sell your personal data to third parties. We may share data with service providers who help us operate the platform (such as hosting providers and analytics tools). These providers are bound by confidentiality agreements and may only use your data as necessary to provide services to us. We may disclose information if required by law.",
    },
    {
      title: "5. Your Rights",
      content:
        "You have the right to access your personal data and receive a copy, request correction of inaccurate data, request deletion of your data (subject to legal retention requirements), object to certain processing activities, and export your data in a portable format. To exercise these rights, contact us at support@prostep2market.com.",
    },
    {
      title: "6. Cookies",
      content:
        "We use cookies and similar tracking technologies to analyze platform usage and improve your experience. We use only analytics cookies that help us understand how visitors use our platform. You can control cookies through your browser settings, but disabling cookies may affect some features of the platform.",
    },
    {
      title: "7. Contact Us",
      content:
        "If you have questions or concerns about this Privacy Policy or our data practices, please contact us at support@prostep2market.com. We will respond to your inquiry within 30 days.",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Privacy Policy
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
          If you have questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:support@prostep2market.com" className="text-[#E53935] hover:underline">
            support@prostep2market.com
          </a>
        </p>
      </div>
    </div>
  );
}