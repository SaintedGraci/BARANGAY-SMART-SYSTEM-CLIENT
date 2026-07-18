import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, ArrowRight, ShieldCheck, Eye, EyeOff, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import bakilidLogo from "../assets/bakilidlogo.png";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      const userData = JSON.parse(localStorage.getItem("user"));

      if (userData && ["admin", "staff", "captain"].includes(userData.role)) {
        navigate("/admin/dashboard");
      } else {
        setError("Access denied. Admin credentials required.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="relative flex min-h-screen bg-slate-950 text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-[420px] w-[420px] rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-[360px] w-[360px] rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[320px] w-[320px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(15 23 42 / 0.8) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* LEFT: Admin Form */}
      <div className="relative z-10 flex w-full flex-col justify-between px-4 py-4 sm:px-8 sm:py-6 md:max-w-xl lg:px-12 lg:py-8">
        {/* Header */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2.5 rounded-xl bg-slate-900/40 px-2.5 py-1.5 backdrop-blur-sm transition hover:bg-slate-900/70"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-900/80 p-1 shadow-sm">
            <img
              src={bakilidLogo}
              alt="Bakilid Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Barangay Bakilid
            </span>
            <span className="mt-0.5 inline-flex items-center rounded-full bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300">
              Admin Operations Portal
            </span>
          </div>
        </button>

        {/* Form */}
        <div className="my-auto w-full max-w-sm self-center py-10">
          <div className="mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-medium text-indigo-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400" />
              </span>
              Officials & staff access only
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.1rem]">
                Sign in to admin console
              </h1>
              <p className="text-sm leading-relaxed text-slate-400">
                Manage requests, announcements, and resident records from a
                secure dashboard.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300 shadow-[0_0_0_1px_rgba(248,113,113,0.15)]"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-400" />
                <p className="text-xs sm:text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400"
              >
                Official Email
              </label>
              <div className="relative group">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-300" />
                <input
                  id="email"
                  type="email"
                  required
                  disabled={isLoading}
                  placeholder="official@bakilid.gov.ph"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-800/80 bg-slate-900/60 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none shadow-sm shadow-slate-950/40 transition-all focus:border-indigo-500/70 focus:bg-slate-950/80 focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400"
                >
                  Password
                </label>
                <span className="text-[11px] font-medium text-slate-500">
                  For security, reset via{" "}
                  <span className="text-slate-200/80">IT officer</span>
                </span>
              </div>
              <div className="relative group">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-300" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-800/80 bg-slate-900/60 py-3.5 pl-11 pr-11 text-sm text-white placeholder-slate-500 outline-none shadow-sm shadow-slate-950/40 transition-all focus:border-indigo-500/70 focus:bg-slate-950/80 focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Verifying admin access...</span>
                </>
              ) : (
                <>
                  <span>Sign in to admin dashboard</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <p>
              Wrong page?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-slate-200 underline underline-offset-4 transition-colors hover:text-white"
              >
                Go to resident login
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800/70 pt-4 text-[11px] text-slate-500">
          <p>© 2026 Brgy. Bakilid</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin connection secured
          </span>
        </div>
      </div>

      {/* RIGHT: Visual Panel */}
      <div className="relative hidden flex-1 items-center justify-center border-l border-slate-800/60 px-10 lg:flex">
        <div className="relative z-10 w-full max-w-md space-y-6 text-center">
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5 backdrop-blur-xl shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-slate-800/70 pb-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Barangay Command Panel
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Secure
              </span>
            </div>
            <div className="mt-4 space-y-3 text-left">
              <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                <div>
                  <p className="text-[11px] text-slate-400">Requests today</p>
                  <p className="mt-1 text-xl font-semibold text-white">128</p>
                </div>
                <div className="text-right text-[11px] text-emerald-300">
                  <p>92% cleared</p>
                  <p className="text-[10px] text-emerald-400/80">
                    within service level
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                  <p className="text-[11px] text-slate-400">
                    Pending approvals
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">19</p>
                  <p className="mt-1 text-[10px] text-sky-300">
                    clearances & permits
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
                  <p className="text-[11px] text-slate-400">
                    Active notifications
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">7</p>
                  <p className="mt-1 text-[10px] text-violet-300">
                    resident updates queued
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Operate your barangay smarter.
            </h2>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-400">
              Centralize approvals, monitor workloads, and keep residents
              informed—all from a single, secure admin console.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
