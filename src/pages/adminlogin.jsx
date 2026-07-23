import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, ArrowRight, Eye, EyeOff, Lock } from "lucide-react";
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

      if (userData && ["admin", "staff", "secretary", "captain"].includes(userData.role)) {
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
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Decorative elements - purple theme */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top purple bar */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#4A1D6B] via-[#5A2D7B] to-transparent shadow-2xl">
          <div className="absolute top-6 left-12 flex gap-6 text-white/30">
            <span className="text-2xl font-light animate-pulse">+</span>
            <span className="text-2xl font-light animate-pulse" style={{ animationDelay: '0.5s' }}>+</span>
          </div>
          <div className="absolute top-5 right-12 flex gap-2">
            <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 transform rotate-45 shadow-lg"></div>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 transform rotate-45 shadow-lg"></div>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 transform rotate-45 shadow-lg"></div>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 transform rotate-45 shadow-lg"></div>
          </div>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-2xl shadow-blue-500/50 animate-bounce" style={{ animationDuration: '3s' }}></div>
          </div>
        </div>

        {/* Bottom purple bar */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#4A1D6B] via-[#5A2D7B] to-transparent shadow-2xl">
          <div className="absolute bottom-6 left-8 flex gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-lg shadow-blue-400/50"></div>
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-lg shadow-blue-400/50" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-lg shadow-blue-400/50" style={{ animationDelay: '0.6s' }}></div>
          </div>
          <div className="absolute bottom-6 right-12 flex gap-6 text-white/30">
            <span className="text-2xl font-light animate-pulse">+</span>
            <span className="text-2xl font-light animate-pulse" style={{ animationDelay: '0.5s' }}>+</span>
          </div>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full border-4 border-purple-300/50 animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full border-4 border-purple-300/60"></div>
        </div>

        {/* Vertical divider */}
        <div className="absolute top-20 bottom-20 left-1/2 transform -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-purple-200 to-transparent"></div>
      </div>

      {/* LEFT SIDE - Admin Illustration */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 lg:px-12 bg-gradient-to-br from-white to-gray-50">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Clickable Logo */}
          <button
            onClick={() => navigate("/")}
            className="group relative mb-6"
            aria-label="Go to home page"
          >
            <div className="absolute -inset-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-white to-gray-50 border-4 border-purple-200 group-hover:border-purple-400 p-3 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
              <img
                src={bakilidLogo}
                alt="Barangay Bakilid Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </button>

          {/* Branding */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Barangay Bakilid</h2>
            <p className="text-base text-purple-600 font-semibold">Administrative Portal</p>
          </div>

          {/* Admin Girl Illustration */}
          <div className="relative w-full">
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '4s' }}></div>
            <img 
              src="/Admin-bro.png" 
              alt="Admin Portal" 
              className="relative w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 lg:px-12 bg-white">
        <div className="w-full max-w-md">
          {/* Badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full border-2 border-purple-200 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
              <span className="text-xs font-semibold text-purple-700">Admin Access Portal</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-block p-3 mb-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-xl">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">
              Login as <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Admin</span>
            </h1>
            <p className="text-gray-500 text-sm">Access the administrative dashboard securely</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border-2 border-red-200 animate-slideIn shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-600"></div>
                </div>
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition duration-300"></div>
                <div className="relative">
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    disabled={isLoading}
                    placeholder="admin@bakilid.gov.ph"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="relative w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition duration-300"></div>
                <div className="relative">
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="relative w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full group mt-5"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-300 animate-gradient-x"></div>
              <div className="relative bg-gradient-to-r from-[#4A1D6B] to-[#5A2D7B] text-white py-3.5 px-6 rounded-xl font-bold text-base hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 hover:scale-[1.02] transform">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span className="tracking-wide">ACCESS DASHBOARD</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">or</span>
            </div>
          </div>

          {/* Resident Link */}
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 px-6 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-purple-300 hover:text-purple-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <User className="w-5 h-5" />
            <span>Go to Resident Portal</span>
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-5">Protected by enterprise-grade security 🔐</p>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
