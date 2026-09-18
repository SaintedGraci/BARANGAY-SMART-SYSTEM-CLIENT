import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import axios from "axios";
import bakilidLogo from "../assets/bakilidlogo.png";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Invalid reset link. No token provided.");
        setIsVerifying(false);
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/verify-reset-token`,
          { token }
        );

        if (response.data.valid) {
          setTokenValid(true);
          setEmail(response.data.email || "");
        } else {
          setError(response.data.message || "Invalid or expired reset link.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "This reset link is invalid or has expired."
        );
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/reset-password`,
        {
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        }
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

  // Loading state
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-neutral-200 border-t-neutral-950 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!tokenValid && !isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 p-4">
        <div className="w-full max-w-md">
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

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-rose-600" />
              </div>
              
              <h2 className="text-xl font-bold text-neutral-950 mb-2">
                Invalid Reset Link
              </h2>
              
              <p className="text-sm text-neutral-600 mb-6">
                {error || "This password reset link is invalid or has expired."}
              </p>

              <Link
                to="/forgot-account"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 mb-3"
              >
                Request New Link
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 p-4">
        <div className="w-full max-w-md">
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

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-xl font-bold text-neutral-950 mb-2">
                Password Reset Successful
              </h2>
              
              <p className="text-sm text-neutral-600 mb-6">
                Your password has been successfully reset. You can now log in using your new password.
              </p>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-neutral-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 p-4">
      <div className="w-full max-w-md">
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

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-950 mb-2">
              Create New Password
            </h2>
            <p className="text-sm text-neutral-600">
              Enter a new password for your account{email && `: ${email}`}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <p className="text-xs font-medium text-rose-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-11 text-sm text-neutral-950 placeholder:text-neutral-400 outline-none transition focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-neutral-400 hover:text-neutral-700 transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-neutral-500">
                Minimum 6 characters
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value
                    })
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-11 text-sm text-neutral-950 placeholder:text-neutral-400 outline-none transition focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-3.5 text-neutral-400 hover:text-neutral-700 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
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
                  <span>Resetting Password...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Reset Password
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
