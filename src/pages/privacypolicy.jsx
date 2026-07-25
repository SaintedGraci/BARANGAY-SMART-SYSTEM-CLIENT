import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Clock, Building2 } from "lucide-react";
import bakilidLogo from "../assets/bakilidlogo.png";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
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
                <p className="text-xs text-slate-500">Privacy Policy</p>
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
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Shield className="h-10 w-10 text-white" strokeWidth={2} />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
              <p className="text-lg text-slate-600 mb-4">
                Your privacy is important to us. Learn how we protect your data.
              </p>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Last updated: January 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>Data Privacy Act Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-10 space-y-10">
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">1</div>
                <h2 className="text-2xl font-bold text-slate-900">Introduction</h2>
              </div>
              <p className="text-slate-700 leading-relaxed pl-11">
                Barangay Bakilid is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use the Barangay Bakilid Smart System.
              </p>
            </section>

            {/* Section 2 - Information Collection */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">2</div>
                <h2 className="text-2xl font-bold text-slate-900">Information We Collect</h2>
              </div>
              <div className="pl-11 space-y-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['Full name and date of birth', 'Contact information', 'Residential address', 'Government IDs', 'Proof of residency'].map((item, idx) => (
                      <div key={idx} className="flex gap-2 text-sm text-slate-700">
                        <span className="flex-shrink-0 mt-1.5 h-1 w-1 rounded-full bg-purple-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    Account Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['Username (encrypted)', 'Verification status', 'Login activity logs'].map((item, idx) => (
                      <div key={idx} className="flex gap-2 text-sm text-slate-700">
                        <span className="flex-shrink-0 mt-1.5 h-1 w-1 rounded-full bg-purple-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    Usage Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['Document requests', 'System interactions', 'Device information'].map((item, idx) => (
                      <div key={idx} className="flex gap-2 text-sm text-slate-700">
                        <span className="flex-shrink-0 mt-1.5 h-1 w-1 rounded-full bg-purple-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Remaining sections */}
            {[
              { num: 3, title: 'How We Use Your Information', content: 'We use collected information for account verification, processing requests, sending announcements, maintaining legal records, improving security, responding to inquiries, and generating statistical reports using anonymized data.' },
              { num: 4, title: 'Data Storage and Security', content: 'We implement encrypted password storage, secure HTTPS connections, access controls, regular security audits, and secure cloud hosting with backup systems to protect your information.' },
              { num: 5, title: 'Information Sharing', content: 'We do not sell or rent your personal information. We only share data with barangay officials for administrative purposes, when required by law, with your explicit consent, or to protect rights and safety.' },
              { num: 6, title: 'Your Rights', content: 'You can access your personal data, request corrections, request account deletion, object to data processing, and withdraw consent at any time by contacting the Barangay Office.' },
              { num: 7, title: 'Data Retention', content: 'We retain your information as long as necessary to fulfill outlined purposes, unless a longer retention period is required by law. Inactive accounts may be archived after prolonged inactivity.' },
              { num: 8, title: 'Cookies and Tracking', content: 'Our system uses essential cookies to maintain your session and improve user experience. We do not use third-party advertising or tracking cookies.' },
              { num: 9, title: 'Children\'s Privacy', content: 'This platform is intended for residents of legal age. If you are under 18, you must have parental or guardian consent to register and use the system.' },
              { num: 10, title: 'Changes to This Policy', content: 'We may update this Privacy Policy periodically. Users will be notified of significant changes through the platform. Continued use after changes indicates acceptance.' }
            ].map((section) => (
              <section key={section.num}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">{section.num}</div>
                  <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                </div>
                <p className="text-slate-700 leading-relaxed pl-11">{section.content}</p>
              </section>
            ))}

            {/* Contact Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">11</div>
                <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
              </div>
              <div className="pl-11 bg-purple-50 rounded-xl p-6 border border-purple-200">
                <p className="text-slate-700 leading-relaxed mb-3">For privacy concerns or questions:</p>
                <div className="space-y-2 text-slate-700">
                  <p className="font-semibold">Barangay Bakilid Office</p>
                  <p>Email: barangaybakilid@gov.ph</p>
                  <p>Phone: (Contact Number)</p>
                  <p>Address: Barangay Bakilid, Mandaue City</p>
                </div>
              </div>
            </section>

            {/* Compliance Badge */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">12</div>
                <h2 className="text-2xl font-bold text-slate-900">Compliance</h2>
              </div>
              <div className="pl-11 bg-green-50 rounded-xl p-6 border border-green-200">
                <p className="text-slate-700 leading-relaxed">
                  <strong className="text-green-700">✓ Compliant</strong> with the Data Privacy Act of 2012 (Republic Act No. 10173) 
                  and its implementing rules and regulations.
                </p>
              </div>
            </section>
          </div>

          {/* Footer with Action */}
          <div className="border-t border-slate-200 bg-purple-50 p-8">
            <button
              onClick={() => window.close() || navigate('/register')}
              className="w-full py-4 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              I Understand and Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
