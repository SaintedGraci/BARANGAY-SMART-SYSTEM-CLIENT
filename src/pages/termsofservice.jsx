import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, FileText } from "lucide-react";
import bakilidLogo from "../assets/bakilidlogo.png";

export default function TermsOfService() {
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
              <p className="text-xs text-slate-500 font-medium">Terms of Service</p>
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
          <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
          
          <div className="p-10">
            {/* Icon and Title */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-xl bg-blue-600 flex items-center justify-center">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Terms of Service</h1>
                <p className="text-sm text-slate-500 mt-1">Last updated: January 2026</p>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-slate max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-slate-700 leading-relaxed">
                  By accessing and using the Barangay Bakilid Smart System, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use this platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. User Registration</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  To access certain features, you must register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Provide accurate and complete information during registration</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                  <li>Submit valid identification documents for verification</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Verification Process</h2>
                <p className="text-slate-700 leading-relaxed">
                  All registered accounts must be verified by Barangay administrators before gaining full access. 
                  The verification process includes review of submitted identification and proof of residency. 
                  Barangay Bakilid reserves the right to approve or reject any registration at its discretion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Acceptable Use</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  You agree to use the platform only for lawful purposes. Prohibited activities include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Submitting false or misleading information</li>
                  <li>Impersonating another person or entity</li>
                  <li>Interfering with system security or integrity</li>
                  <li>Attempting unauthorized access to other accounts</li>
                  <li>Uploading malicious files or code</li>
                  <li>Harassing or threatening other users or staff</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Services Offered</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  The platform provides access to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Document request services (Barangay Clearance, Certificates, etc.)</li>
                  <li>Complaint filing and tracking</li>
                  <li>Barangay announcements and updates</li>
                  <li>Contact information for barangay officials</li>
                  <li>Real-time notifications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Document Requests</h2>
                <p className="text-slate-700 leading-relaxed">
                  Document requests are subject to processing times and verification requirements. 
                  Payment, if applicable, must be completed before document release. 
                  Barangay Bakilid reserves the right to reject requests that do not meet requirements or contain false information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Intellectual Property</h2>
                <p className="text-slate-700 leading-relaxed">
                  All content, logos, and materials on this platform are the property of Barangay Bakilid. 
                  You may not reproduce, distribute, or create derivative works without written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Limitation of Liability</h2>
                <p className="text-slate-700 leading-relaxed">
                  Barangay Bakilid is not liable for any direct, indirect, incidental, or consequential damages arising from 
                  the use or inability to use this platform. The platform is provided "as is" without warranties of any kind.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Account Termination</h2>
                <p className="text-slate-700 leading-relaxed">
                  We reserve the right to suspend or terminate accounts that violate these terms or engage in prohibited activities. 
                  You may also request account deletion by contacting barangay officials.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Modifications to Terms</h2>
                <p className="text-slate-700 leading-relaxed">
                  Barangay Bakilid may update these Terms of Service at any time. 
                  Continued use of the platform after changes constitutes acceptance of the new terms. 
                  Users will be notified of significant changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Contact Information</h2>
                <p className="text-slate-700 leading-relaxed">
                  For questions about these Terms of Service, please contact:<br />
                  <strong>Barangay Bakilid Office</strong><br />
                  Email: barangaybakilid@gov.ph<br />
                  Phone: (Contact Number)
                </p>
              </section>
            </div>

            {/* Footer Button */}
            <div className="mt-10 pt-8 border-t border-slate-200">
              <button
                onClick={() => navigate(-1)}
                className="w-full py-3 px-6 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
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
