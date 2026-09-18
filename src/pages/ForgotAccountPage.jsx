import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import bakilidLogo from "../assets/bakilidlogo.png";

export default function ForgotAccountPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/forgot-account`,
        { email: email.trim() }
      );

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src={bakilidLogo}
              alt="Barangay Bakilid"
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-xl font-bold text-neutral-950">
              Barangay Bakilid
            </h1>
            <p className="text-sm text-neutral-500">Smart System</p>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-xl font-bold text-neutral-950 mb-2">
                Check Your Email
              </h2>
              
              <p className="text-sm text-neutral-600 mb-6">
                If an account with that email exists, we've sent password reset instructions to:
              </p>
              
              <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-4 mb-6">
                <p className="text-sm font-medium text-neutral-950">{email}</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-blue-900 mb-1">
                      Important
                    </p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      The reset link will expire in 30 minutes. If you don't see the email, check your spam folder.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src={bakilidLogo}
            alt="Barangay Bakilid"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-neutral-950">
            Barangay Bakilid
          </h1>
          <p className="text-sm text-neutral-500">Smart System</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-950 mb-2">
              Forgot Account?
            </h2>
            <p className="text-sm text-neutral-600">
              Enter the Gmail address registered to your resident account. We'll send instructions to help you recover your account.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  placeholder="your.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 placeholder:text-neutral-400 outline-none transition focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 disabled:opacity-50"
                />
                <Mail className="absolute right-4 top-3.5 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                "Recover Account"
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-neutral-50 border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-600 leading-relaxed">
            <strong className="font-semibold text-neutral-900">Note:</strong> Only accounts with a registered Gmail address can use password recovery. If you don't have a registered email, please contact the barangay office for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
