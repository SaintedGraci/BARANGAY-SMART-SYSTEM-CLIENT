import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import bakilidLogo from "../assets/bakilidlogo.png";
import { Turnstile } from "@marsidev/react-turnstile";
import { TurnstileDebug } from "../components/TurnstileDebug";
import { TURNSTILE_SITE_KEY, isTurnstileAvailable } from "../config/turnstile";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (isTurnstileAvailable && !turnstileToken) {
      setError("Please complete the verification challenge");
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(
        formData.username, 
        formData.password, 
        turnstileToken || 'MISSING_TURNSTILE'
      );

      if (result.success) {
        const userData = JSON.parse(localStorage.getItem("user"));

        if (userData && userData.role === "resident") {
          navigate("/dashboard");
        } else {
          setError("This login is for residents only. Please use the admin portal.");
          await logout();
          setIsLoading(false);
          setTurnstileToken("");
          turnstileRef.current?.reset();
        }
      } else {
        setError(result.message || "Invalid username or password");
        setIsLoading(false);
        setTurnstileToken("");
        turnstileRef.current?.reset();
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      setIsLoading(false);
      setTurnstileToken("");
      turnstileRef.current?.reset();
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 font-sans flex flex-col justify-between relative overflow-hidden vercel-grid-pattern antialiased">
      <TurnstileDebug />

      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white p-1 shadow-xs transition group-hover:border-neutral-300">
              <img src={bakilidLogo} alt="Bakilid Logo" className="h-full w-full object-contain" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold tracking-tight text-neutral-900">Barangay Bakilid</p>
              <p className="text-[11px] font-medium text-neutral-500">Resident Portal</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/login")}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs transition hover:bg-neutral-50 hover:text-neutral-900"
            >
              <Lock className="h-3.5 w-3.5 text-neutral-500" />
              Admin Login
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-neutral-900/5 backdrop-blur-xl">
            {/* Header Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                Resident Portal
              </span>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                Enter your credentials to access your resident dashboard
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
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-950 placeholder:text-neutral-400 outline-none transition focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 disabled:opacity-50"
                  />
                  <User className="absolute right-4 top-3.5 h-4 w-4 text-neutral-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Password
                  </label>
                  <span className="text-xs text-neutral-400">Forgot? Contact Barangay Office</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-11 text-sm text-neutral-950 placeholder:text-neutral-400 outline-none transition focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-neutral-400 hover:text-neutral-700 transition"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Turnstile Widget */}
              <div className="flex flex-col items-center pt-2">
                {isTurnstileAvailable ? (
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => {
                      setTurnstileToken("");
                      setError("Verification failed. Please try again.");
                    }}
                    onExpire={() => {
                      setTurnstileToken("");
                      setError("Verification expired. Please verify again.");
                    }}
                    options={{ theme: "light", size: "normal" }}
                  />
                ) : (
                  <div className="text-center p-3 bg-rose-50 border border-rose-200 rounded-xl w-full">
                    <p className="text-xs text-rose-600 font-semibold">Security verification unavailable</p>
                  </div>
                )}
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Resident Portal</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
              <p className="text-xs text-neutral-500">
                Don&apos;t have a resident account yet?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="font-semibold text-neutral-950 hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-neutral-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-neutral-400" />
            Protected by enterprise-grade security
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-neutral-400 border-t border-neutral-200/60 bg-white/50">
        &copy; 2026 Barangay Bakilid. All rights reserved.
      </footer>
    </div>
  );
}