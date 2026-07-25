import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Clock, Building2 } from "lucide-react";
import bakilidLogo from "../assets/bakilidlogo.png";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Modern Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-md p-2">
                <img src={bakilidLogo} alt="Bakilid Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900">Barangay Bakilid</span>
                <p className="text-xs text-slate-500">Terms of Service</p>
              </div>
            </div>
            <button
              onClick={() => window.close() || navigate('/register')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <FileText className="h-10 w-10 text-white" strokeWidth={2} />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
              <p className="text-lg text-slate-600 mb-4">
                Please read these terms carefully before using our platform
              </p>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Last updated: January 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>Barangay Bakilid, Mandaue City</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-10 space-y-10">
            {/* Section 1 */}
            <section className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                <h2 className="text-2xl font-bold text-slate-900">Acceptance of Terms</h2>
              </div>
              <p className="text-slate-700 leading-relaxed pl-11">
                By accessing and using the Barangay Bakilid Smart System, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use this platform.
              </p>
            </section>

            {/* Section 2 */}
            <section className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                <h2 className="text-2xl font-bold text-slate-900">User Registration</h2>
              </div>
              <div className="pl-11 space-y-3">
                <p className="text-slate-700 leading-relaxed">To access certain features, you must register for an account. You agree to:</p>
                <ul className="space-y-2">
                  {[
                    'Provide accurate and complete information during registration',
                    'Maintain the security of your account credentials',
                    'Notify us immediately of any unauthorized access',
                    'Be responsible for all activities under your account',
                    'Submit valid identification documents for verification'
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-700">
                      <span className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                <h2 className="text-2xl font-bold text-slate-900">Verification Process</h2>
              </div>
              <p className="text-slate-700 leading-relaxed pl-11">
                All registered accounts must be verified by Barangay administrators before gaining full access. 
                The verification process includes review of submitted identification and proof of residency. 
                Barangay Bakilid reserves the right to approve or reject any registration at its discretion.
              </p>
            </section>

            {/* Section 4 */}
            <section className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">4</div>
                <h2 className="text-2xl font-bold text-slate-900">Acceptable Use</h2>
              </div>
              <div className="pl-11 space-y-3">
                <p className="text-slate-700 leading-relaxed">You agree to use the platform only for lawful purposes. Prohibited activities include:</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Submitting false information',
                    'Impersonating another person',
                    'Interfering with system security',
                    'Unauthorized account access',
                    'Uploading malicious files',
                    'Harassing users or staff'
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-slate-700 bg-slate-50 rounded-lg p-3">
                      <span className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Remaining sections with similar styling */}
            {[
              { num: 5, title: 'Services Offered', content: 'The platform provides document request services, complaint filing, barangay announcements, official contact information, and real-time notifications.' },
              { num: 6, title: 'Document Requests', content: 'Document requests are subject to processing times and verification requirements. Payment must be completed before document release. We reserve the right to reject requests that do not meet requirements.' },
              { num: 7, title: 'Intellectual Property', content: 'All content, logos, and materials on this platform are the property of Barangay Bakilid. You may not reproduce, distribute, or create derivative works without written permission.' },
              { num: 8, title: 'Limitation of Liability', content: 'Barangay Bakilid is not liable for any damages arising from the use or inability to use this platform. The platform is provided "as is" without warranties of any kind.' },
              { num: 9, title: 'Account Termination', content: 'We reserve the right to suspend or terminate accounts that violate these terms. You may also request account deletion by contacting barangay officials.' },
              { num: 10, title: 'Modifications to Terms', content: 'Barangay Bakilid may update these Terms of Service at any time. Continued use after changes constitutes acceptance of the new terms.' }
            ].map((section) => (
              <section key={section.num} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">{section.num}</div>
                  <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                </div>
                <p className="text-slate-700 leading-relaxed pl-11">{section.content}</p>
              </section>
            ))}

            {/* Contact Section */}
            <section className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">11</div>
                <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>
              </div>
              <div className="pl-11 bg-slate-50 rounded-xl p-6 border border-slate-200">
                <p className="text-slate-700 leading-relaxed mb-3">For questions about these Terms of Service, please contact:</p>
                <div className="space-y-2 text-slate-700">
                  <p className="font-semibold">Barangay Bakilid Office</p>
                  <p>Email: barangaybakilid@gov.ph</p>
                  <p>Phone: (Contact Number)</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer with Action */}
          <div className="border-t border-slate-200 bg-slate-50 p-8">
            <button
              onClick={() => window.close() || navigate('/register')}
              className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              I Understand and Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
