import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import bakilidLogo from "../assets/bakilidlogo.png";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-md p-2 transition-transform group-hover:scale-110">
              <img src={bakilidLogo} alt="Bakilid Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-800">Barangay Bakilid</span>
              <p className="text-xs text-slate-500 font-medium">Privacy Policy</p>
            </div>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
          {/* Header Accent */}
          <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-600" />
          
          <div className="p-10">
            {/* Icon and Title */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-xl bg-purple-600 flex items-center justify-center">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
                <p className="text-sm text-slate-500 mt-1">Last updated: January 2026</p>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-slate max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
                <p className="text-slate-700 leading-relaxed">
                  Barangay Bakilid is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you use the Barangay Bakilid Smart System.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Personal Information</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                      <li>Full name, date of birth, and gender</li>
                      <li>Contact information (mobile number, email address)</li>
                      <li>Residential address within Barangay Bakilid</li>
                      <li>Government-issued identification documents</li>
                      <li>Proof of residency documents</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Account Information</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                      <li>Username and password (encrypted)</li>
                      <li>Account verification status</li>
                      <li>Login history and activity logs</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Usage Information</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                      <li>Document requests and complaint submissions</li>
                      <li>System interaction and navigation patterns</li>
                      <li>Device information and IP address</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Account registration and verification</li>
                  <li>Processing document requests and complaints</li>
                  <li>Communicating important barangay announcements</li>
                  <li>Maintaining records as required by law</li>
                  <li>Improving system security and functionality</li>
                  <li>Responding to inquiries and support requests</li>
                  <li>Generating statistical reports (anonymized data)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Storage and Security</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  We implement appropriate security measures to protect your information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Encrypted password storage using industry-standard algorithms</li>
                  <li>Secure HTTPS connections for data transmission</li>
                  <li>Access controls limiting staff access to sensitive data</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Secure cloud hosting with backup systems</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Information Sharing</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  We do not sell or rent your personal information. We may share information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>With barangay officials for legitimate administrative purposes</li>
                  <li>When required by law or legal process</li>
                  <li>With your explicit consent</li>
                  <li>To protect the rights and safety of the barangay and its residents</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Access your personal data stored in our system</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your account and data</li>
                  <li>Object to certain data processing activities</li>
                  <li>Withdraw consent at any time</li>
                </ul>
                <p className="text-slate-700 leading-relaxed mt-3">
                  To exercise these rights, contact the Barangay Office directly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Data Retention</h2>
                <p className="text-slate-700 leading-relaxed">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, 
                  unless a longer retention period is required by law. Inactive accounts may be archived after a period of inactivity.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Cookies and Tracking</h2>
                <p className="text-slate-700 leading-relaxed">
                  Our system uses essential cookies to maintain your session and improve user experience. 
                  We do not use third-party advertising or tracking cookies. You can manage cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Children's Privacy</h2>
                <p className="text-slate-700 leading-relaxed">
                  This platform is intended for residents of legal age. If you are under 18, you must have parental or guardian 
                  consent to register and use the system.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Changes to This Policy</h2>
                <p className="text-slate-700 leading-relaxed">
                  We may update this Privacy Policy periodically. We will notify users of significant changes through the platform. 
                  Your continued use after changes indicates acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Us</h2>
                <p className="text-slate-700 leading-relaxed">
                  If you have questions or concerns about this Privacy Policy or how your data is handled, please contact:<br />
                  <strong>Barangay Bakilid Office</strong><br />
                  Email: barangaybakilid@gov.ph<br />
                  Phone: (Contact Number)<br />
                  Address: Barangay Bakilid, Mandaue City
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Compliance</h2>
                <p className="text-slate-700 leading-relaxed">
                  This Privacy Policy complies with the Data Privacy Act of 2012 (Republic Act No. 10173) and its implementing rules and regulations.
                </p>
              </section>
            </div>

            {/* Footer Button */}
            <div className="mt-10 pt-8 border-t border-slate-200">
              <button
                onClick={() => navigate(-1)}
                className="w-full py-3 px-6 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
