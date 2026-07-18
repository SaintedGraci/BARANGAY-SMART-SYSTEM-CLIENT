import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import bakilidLogo from "../assets/bakilidlogo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      const userData = JSON.parse(localStorage.getItem("user"));

      if (userData && userData.role === "resident") {
        navigate("/dashboard");
      } else {
        setError(
          "This login is for residents only. Please use the admin login."
        );
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="relative flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-[420px] w-[420px] rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-[360px] w-[360px] rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[320px] w-[320px] rounded-full bg-violet-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(30 64 175 / 0.4) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* LEFT: Login Form */}
      <div className="relative z-10 flex w-full flex-col justify-between px-4 py-4 sm:px-8 sm:py-6 md:max-w-xl lg:px-12 lg:py-8">
        {/* Header / Logo */}
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
            <span className="mt-0.5 inline-flex items-center rounded-full bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-medium text-sky-400">
              Smart Resident Portal
            </span>
          </div>
        </button>

        {/* Form Card */}
        <div className="my-auto w-full max-w-sm self-center py-10">
          <div className="mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/5 px-3 py-1 text-[11px] font-medium text-emerald-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Secure resident access
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.1rem]">
                Sign in to your portal
              </h1>
              <p className="text-sm leading-relaxed text-slate-400">
                Manage document requests, track statuses, and stay updated with
                your barangay in one place.
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
                Email Address
              </label>
              <div className="relative group">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-sky-400" />
                <input
                  id="email"
                  type="email"
                  required
                  disabled={isLoading}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-800/80 bg-slate-900/60 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none shadow-sm shadow-slate-950/40 transition-all focus:border-sky-500/60 focus:bg-slate-950/80 focus:ring-4 focus:ring-sky-500/15 disabled:cursor-not-allowed disabled:opacity-70"
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
                  Forgot password?{" "}
                  <span className="cursor-default text-slate-300/70">
                    Contact barangay office
                  </span>
                </span>
              </div>
              <div className="relative group">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-sky-400" />
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
                  className="w-full rounded-xl border border-slate-800/80 bg-slate-900/60 py-3.5 pl-11 pr-11 text-sm text-white placeholder-slate-500 outline-none shadow-sm shadow-slate-950/40 transition-all focus:border-sky-500/60 focus:bg-slate-950/80 focus:ring-4 focus:ring-sky-500/15 disabled:cursor-not-allowed disabled:opacity-70"
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

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="inline-flex cursor-pointer items-center gap-2">
                <span className="relative">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rememberMe: e.target.checked,
                      })
                    }
                    disabled={isLoading}
                    className="peer h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 outline-none transition focus:ring-2 focus:ring-sky-500/40 focus:ring-offset-0"
                  />
                  <span className="pointer-events-none absolute inset-0 rounded border border-slate-700/80 peer-focus:border-sky-500/70" />
                </span>
                <span className="text-sm text-slate-400">Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition-all hover:shadow-xl hover:shadow-sky-500/40 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Signing you in...</span>
                </>
              ) : (
                <>
                  <span>Sign in to resident portal</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Secondary Actions */}
          <div className="mt-6 space-y-3 text-center text-xs text-slate-500">
            <p>
              Need a quick document without an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="font-semibold text-slate-200 underline underline-offset-4 transition-colors hover:text-white"
              >
                Browse services
              </button>
            </p>
            <p>
              Admin or staff?{" "}
              <button
                onClick={() => navigate("/admin/login")}
                className="font-semibold text-sky-400 underline underline-offset-4 transition-colors hover:text-sky-300"
              >
                Sign in to admin portal
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800/70 pt-4 text-[11px] text-slate-500">
          <p>© 2026 Brgy. Smart System</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Encrypted connection
          </span>
        </div>
      </div>

      {/* RIGHT: Visual Panel */}
      <div className="relative hidden flex-1 items-center justify-center border-l border-slate-800/60 px-10 lg:flex">
        <div className="relative z-10 w-full max-w-md space-y-6 text-center">
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5 backdrop-blur-xl shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-slate-800/70 pb-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Live Resident Activity
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-left">
                <p className="text-[11px] text-slate-400">Average approval time</p>
                <p className="mt-1 text-xl font-semibold text-white">14 mins</p>
                <p className="mt-1 text-[10px] text-emerald-300">
                  for barangay clearances
                </p>
              </div>
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-left">
                <p className="text-[11px] text-slate-400">Active digital IDs</p>
                <p className="mt-1 text-xl font-semibold text-white">1,248</p>
                <p className="mt-1 text-[10px] text-sky-300">
                  residents onboarded this month
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Digital-first barangay services.
            </h2>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-400">
              Skip the queues and paper forms. Log in to request documents,
              monitor progress, and receive updates in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}