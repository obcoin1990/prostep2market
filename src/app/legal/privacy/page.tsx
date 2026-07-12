export const metadata = {
  title: "Privacy Policy - ProStep2Market",
  description: "Privacy Policy for ProStep2Market trading performance platform — GDPR and CCPA compliant.",
};

const LAST_UPDATED = "July 12, 2026";

export default function PrivacyPage() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Privacy Policy
      </h1>
      <p className="text-gray-500 mb-8">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="space-y-8">
        {/* 1. Data Controller */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Data Controller</h2>
          <p className="text-gray-600 leading-relaxed">
            ProStep2Market Ltd. (&quot;ProStep2Market&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is the data controller
            responsible for your personal data. Our registered address is 167-169 Great Portland Street, Fifth Floor, London, W1W 5PF, United Kingdom.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            Data Protection Officer:{" "}
            <a href="mailto:dpo@prostep2market.com" className="text-blue-600 hover:underline">dpo@prostep2market.com</a>
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            EU/UK Representative (if required): Same as data controller address above, or contact <a href="mailto:dpo@prostep2market.com" className="text-blue-600 hover:underline">dpo@prostep2market.com</a>
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">2. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            We collect the following categories of personal data:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-700">Category</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Examples</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Legal Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">Account data</td>
                  <td className="p-3">Name, email address, password (hashed)</td>
                  <td className="p-3">Contract performance</td>
                </tr>
                <tr>
                  <td className="p-3">Trading data</td>
                  <td className="p-3">Trade entries/exits, strategy labels, journal notes, screenshots</td>
                  <td className="p-3">Contract performance; Consent</td>
                </tr>
                <tr>
                  <td className="p-3">Behavioral analytics</td>
                  <td className="p-3">Trader DNA scores, Edge Score metrics, emotional state assessments</td>
                  <td className="p-3">Contract performance; Legitimate interest</td>
                </tr>
                <tr>
                  <td className="p-3">MT4/MT5 connection data</td>
                  <td className="p-3">Broker name, account ID, read-only trade data</td>
                  <td className="p-3">Consent (explicit per-connection)</td>
                </tr>
                <tr>
                  <td className="p-3">Usage data</td>
                  <td className="p-3">Pages visited, features used, session duration, click patterns</td>
                  <td className="p-3">Legitimate interest</td>
                </tr>
                <tr>
                  <td className="p-3">Technical data</td>
                  <td className="p-3">IP address, browser type, device info, operating system</td>
                  <td className="p-3">Legitimate interest</td>
                </tr>
                <tr>
                  <td className="p-3">Payment data</td>
                  <td className="p-3">Subscription plan, billing history (processed by Stripe — we do not store card numbers)</td>
                  <td className="p-3">Contract performance</td>
                </tr>
                <tr>
                  <td className="p-3">Communication data</td>
                  <td className="p-3">Support emails, feedback, survey responses</td>
                  <td className="p-3">Legitimate interest; Consent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. How We Use Your Information */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">3. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed mb-3">We process your personal data for the following purposes:</p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1 ml-4">
            <li>Providing, operating, and maintaining the ProStep2Market platform</li>
            <li>Calculating your Edge Score, Trader DNA profile, and behavioral analytics</li>
            <li>Operating Risk Guardian (real-time behavioral monitoring and alerts)</li>
            <li>Processing your trades and generating AI-powered trade intelligence</li>
            <li>Sending transactional emails (account verification, password resets, billing receipts)</li>
            <li>Sending marketing communications (only with your explicit consent; unsubscribe anytime)</li>
            <li>Detecting and preventing fraud, abuse, and security incidents</li>
            <li>Improving our platform through aggregate, anonymized usage analytics</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        {/* 4. Legal Bases for Processing (GDPR) */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Legal Bases for Processing (GDPR)</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Under the GDPR, we process your data only when we have a valid legal basis. The applicable bases are:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1 ml-4">
            <li><strong>Consent</strong> — You have given clear, informed consent for specific processing (e.g., marketing emails, MT4/MT5 connection, optional analytics). You may withdraw consent at any time.</li>
            <li><strong>Contract performance</strong> — Processing is necessary to provide the service you signed up for (account management, trade journaling, scoring).</li>
            <li><strong>Legitimate interests</strong> — Processing is necessary for our legitimate interests (platform security, fraud prevention, service improvement) and these are not overridden by your rights.</li>
            <li><strong>Legal obligation</strong> — We are required to retain certain data for tax, financial reporting, or regulatory compliance.</li>
          </ul>
        </section>

        {/* 5. Data Security */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Data Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your data:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1 ml-4 mt-2">
            <li>AES-256 encryption of data at rest</li>
            <li>TLS 1.3 encryption of data in transit</li>
            <li>Role-based access controls (principle of least privilege)</li>
            <li>Regular penetration testing and security audits</li>
            <li>SOC 2 Type II compliant infrastructure (Supabase, Vercel)</li>
            <li>Automated vulnerability scanning</li>
            <li>Secure backup and disaster recovery procedures</li>
            <li>Incident response plan with 72-hour breach notification</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-2">
            While we strive to protect your information, no method of transmission over the internet or electronic
            storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        {/* 6. Data Sharing */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Data Sharing and Third Parties</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            We do <strong>not</strong> sell your personal data to third parties. We share data only with the following categories of recipients:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-700">Recipient</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Purpose</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Safeguards</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">Supabase (hosting/database)</td>
                  <td className="p-3">Data storage, authentication, edge functions</td>
                  <td className="p-3">DPA, SOC 2 Type II, encryption at rest</td>
                </tr>
                <tr>
                  <td className="p-3">Vercel (hosting)</td>
                  <td className="p-3">Frontend hosting, serverless functions</td>
                  <td className="p-3">DPA, SOC 2, ISO 27001</td>
                </tr>
                <tr>
                  <td className="p-3">Stripe (payments)</td>
                  <td className="p-3">Subscription billing and payment processing</td>
                  <td className="p-3">PCI DSS Level 1, DPA — we never store card numbers</td>
                </tr>
                <tr>
                  <td className="p-3">Resend (email)</td>
                  <td className="p-3">Transactional and marketing emails</td>
                  <td className="p-3">DPA, GDPR compliant</td>
                </tr>
                <tr>
                  <td className="p-3">Analytics provider</td>
                  <td className="p-3">Aggregate platform usage analytics (anonymized)</td>
                  <td className="p-3">DPA, data anonymized before processing</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 leading-relaxed mt-3">
            We may also disclose data if required by law, court order, or governmental request, or to protect the
            rights, property, or safety of ProStep2Market, our users, or the public.
          </p>
        </section>

        {/* 7. International Data Transfers */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">7. International Data Transfers</h2>
          <p className="text-gray-600 leading-relaxed">
            Your data may be processed in countries other than your country of residence (our infrastructure is
            primarily hosted in the United States and EU). When we transfer data outside the EEA, UK, or
            Switzerland, we ensure adequate protection through:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1 ml-4 mt-2">
            <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
            <li>Adequacy decisions where applicable</li>
            <li>Binding Corporate Rules where applicable</li>
          </ul>
        </section>

        {/* 8. Your Rights (GDPR) */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Your Rights (GDPR)</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have the
            following rights under the General Data Protection Regulation (GDPR):
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1 ml-4">
            <li><strong>Right of access</strong> — Request a copy of the personal data we hold about you</li>
            <li><strong>Right to rectification</strong> — Request correction of inaccurate or incomplete data</li>
            <li><strong>Right to erasure</strong> — Request deletion of your personal data (&quot;right to be forgotten&quot;)</li>
            <li><strong>Right to restriction</strong> — Request restriction of processing in certain circumstances</li>
            <li><strong>Right to data portability</strong> — Receive your data in a structured, machine-readable format</li>
            <li><strong>Right to object</strong> — Object to processing based on legitimate interests, including direct marketing</li>
            <li><strong>Right to withdraw consent</strong> — Withdraw consent at any time (without affecting prior lawful processing)</li>
            <li><strong>Right not to be subject to automated decision-making</strong> — We do not use automated decision-making that produces legal effects</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            To exercise any of these rights, email{" "}
            <a href="mailto:dpo@prostep2market.com" className="text-blue-600 hover:underline">dpo@prostep2market.com</a>.
            We will respond within 30 days. We may ask you to verify your identity before processing your request.
          </p>
        </section>

        {/* 9. Your Rights (CCPA) */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Your Rights (CCPA / CPRA)</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            If you are a California resident, the California Consumer Privacy Act (CCPA) as amended by the
            California Privacy Rights Act (CPRA) grants you the following rights:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1 ml-4">
            <li><strong>Right to know</strong> — What personal information we collect, use, disclose, and sell</li>
            <li><strong>Right to delete</strong> — Request deletion of your personal information</li>
            <li><strong>Right to correct</strong> — Request correction of inaccurate personal information</li>
            <li><strong>Right to opt out of sale/sharing</strong> — We do not sell or share your personal information</li>
            <li><strong>Right to non-discrimination</strong> — We will not discriminate against you for exercising your rights</li>
            <li><strong>Right to limit use of sensitive personal information</strong> — We use sensitive data only as necessary to provide the service</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            To exercise these rights, email{" "}
            <a href="mailto:privacy@prostep2market.com" className="text-blue-600 hover:underline">privacy@prostep2market.com</a>.
          </p>
        </section>

        {/* 10. Data Retention */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">10. Data Retention</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            We retain your personal data only as long as necessary for the purposes described in this policy:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-700">Data Type</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Retention Period</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-3">Account data</td>
                  <td className="p-3">Until account deletion + 30 days</td>
                  <td className="p-3">Service provision</td>
                </tr>
                <tr>
                  <td className="p-3">Trading data &amp; journal</td>
                  <td className="p-3">Until account deletion + 30 days</td>
                  <td className="p-3">Service provision</td>
                </tr>
                <tr>
                  <td className="p-3">Edge Score history</td>
                  <td className="p-3">Until account deletion + 30 days</td>
                  <td className="p-3">Service provision</td>
                </tr>
                <tr>
                  <td className="p-3">Billing records</td>
                  <td className="p-3">7 years from transaction date</td>
                  <td className="p-3">Tax and financial compliance</td>
                </tr>
                <tr>
                  <td className="p-3">Support communications</td>
                  <td className="p-3">3 years from last interaction</td>
                  <td className="p-3">Customer support quality</td>
                </tr>
                <tr>
                  <td className="p-3">Security logs</td>
                  <td className="p-3">12 months</td>
                  <td className="p-3">Security and fraud prevention</td>
                </tr>
                <tr>
                  <td className="p-3">Marketing consent records</td>
                  <td className="p-3">Until withdrawal of consent + 30 days</td>
                  <td className="p-3">GDPR compliance proof</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 leading-relaxed mt-3">
            When data is no longer needed, it is securely deleted or anonymized so that it can no longer be
            associated with you.
          </p>
        </section>

        {/* 11. Cookies */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">11. Cookies and Tracking Technologies</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            We use the following types of cookies:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-1 ml-4">
            <li><strong>Essential cookies</strong> — Required for authentication, security, and core platform functionality. Cannot be disabled.</li>
            <li><strong>Analytics cookies</strong> — Help us understand how visitors use our platform. We use anonymized analytics only. Disabled by default; enabled only with your consent.</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-2">
            We do <strong>not</strong> use advertising or tracking cookies. You can control cookies through your
            browser settings. Disabling essential cookies will prevent you from logging in.
          </p>
        </section>

        {/* 12. Children's Privacy */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">12. Children&apos;s Privacy</h2>
          <p className="text-gray-600 leading-relaxed">
            ProStep2Market is not intended for individuals under the age of 18. We do not knowingly collect personal
            data from children. If we become aware that we have collected personal data from a child under 18, we
            will take steps to delete that information promptly. If you believe a child has provided us with personal
            data, please contact{" "}
            <a href="mailto:dpo@prostep2market.com" className="text-blue-600 hover:underline">dpo@prostep2market.com</a>.
          </p>
        </section>

        {/* 13. Automated Decision-Making */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">13. Automated Decision-Making and Profiling</h2>
          <p className="text-gray-600 leading-relaxed">
            Our AI-powered features (Trader DNA assessment, Edge Score calculation, behavioral pattern detection,
            AI Trade Intelligence) involve automated processing of your trading data to generate insights. These
            outputs are <strong>advisory only</strong> and do not produce legal or similarly significant effects.
            You can opt out of behavioral analytics at any time in your{" "}
            <a href="/dashboard/settings" className="text-blue-600 hover:underline">settings</a>. You have the
            right not to be subject to a decision based solely on automated processing — contact us if you wish to
            exercise this right.
          </p>
        </section>

        {/* 14. Third-Party Links */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">14. Third-Party Links</h2>
          <p className="text-gray-600 leading-relaxed">
            Our platform may contain links to third-party websites, broker platforms, or resources. We are not
            responsible for the privacy practices of these third parties. We encourage you to read the privacy
            policy of every site you visit.
          </p>
        </section>

        {/* 15. Changes to This Policy */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">15. Changes to This Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of material changes by posting
            the new policy on this page, updating the &quot;Last updated&quot; date, and (for material changes)
            sending you an email notification. We encourage you to review this policy periodically.
          </p>
        </section>

        {/* 16. Contact Us and Complaints */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">16. Contact Us and Complaints</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have questions about this Privacy Policy, contact our Data Protection Officer at{" "}
            <a href="mailto:dpo@prostep2market.com" className="text-blue-600 hover:underline">dpo@prostep2market.com</a>.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            If you are in the EEA or UK and believe we have not handled your data properly, you have the right to
            lodge a complaint with your local supervisory authority. In the UK, this is the Information
            Commissioner&apos;s Office (ICO) at{" "}
            <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ico.org.uk</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
