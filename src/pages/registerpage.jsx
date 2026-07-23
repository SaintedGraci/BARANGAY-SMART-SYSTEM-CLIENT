import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Eye, EyeOff, User, Mail, ArrowRight, ArrowLeft, ShieldCheck, Upload, 
  CheckCircle, Calendar, Phone, MapPin, Home, AlertCircle, Check 
} from "lucide-react";
import bakilidLogo from "../assets/bakilidlogo.png";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    contactNumber: "",
    gmail: "",
    houseNo: "",
    street: "",
    purok: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    validId: null,
    proofOfResidency: null
  });

  const [previews, setPreviews] = useState({
    validId: null,
    proofOfResidency: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleFileChange = (field, file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setFormData(prev => ({ ...prev, [field]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName) {
      setError("First name and last name are required");
      return false;
    }
    if (!formData.gender) {
      setError("Gender is required");
      return false;
    }
    if (!formData.birthDate) {
      setError("Date of birth is required");
      return false;
    }
    if (!formData.contactNumber || formData.contactNumber.length < 10) {
      setError("Valid mobile number is required");
      return false;
    }
    if (formData.gmail && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.gmail)) {
      setError("Gmail must be a valid @gmail.com address");
      return false;
    }
    if (!formData.houseNo || !formData.street || !formData.purok) {
      setError("Complete address is required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.username || formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Valid email is required");
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!/[a-z]/.test(formData.password)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (!/[@$!%*?&#]/.test(formData.password)) {
      setError("Password must contain at least one special character (@$!%*?&#)");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!agreeToTerms) {
      setError("You must agree to the Terms and Privacy Policy");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.validId) {
      setError("Please upload a valid ID");
      return false;
    }
    if (!formData.proofOfResidency) {
      setError("Please upload proof of residency");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsLoading(true);
    setError("");

    try {
      const submitData = new FormData();
      submitData.append('username', formData.username);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('firstName', formData.firstName);
      submitData.append('middleName', formData.middleName);
      submitData.append('lastName', formData.lastName);
      submitData.append('gender', formData.gender);
      submitData.append('birthDate', formData.birthDate);
      submitData.append('contactNumber', formData.contactNumber);
      if (formData.gmail) {
        submitData.append('gmail', formData.gmail);
      }
      submitData.append('address', `${formData.houseNo}, ${formData.street}`);
      submitData.append('purok', formData.purok);
      submitData.append('validId', formData.validId);
      submitData.append('proofOfResidency', formData.proofOfResidency);

      const response = await axios.post('http://localhost:5000/api/auth/register', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setRegistrationSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: User, color: "from-blue-500 to-cyan-500" },
    { number: 2, title: "Account", icon: ShieldCheck, color: "from-purple-500 to-pink-500" },
    { number: 3, title: "Verification", icon: Upload, color: "from-orange-500 to-red-500" }
  ];

  if (registrationSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-in-out]">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-10 backdrop-blur-xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
            <div className="relative">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/50">
                <CheckCircle className="h-12 w-12 text-white animate-[bounce_1s_ease-in-out]" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-white text-center">Registration Submitted!</h2>
              <div className="mb-8 space-y-3 text-center">
                <p className="text-slate-300 text-lg">Your registration has been submitted successfully.</p>
                <p className="text-sm text-slate-400">
                  Please wait for the Barangay Administrator to verify your account.
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-5 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Status</p>
                    <p className="text-base font-medium text-amber-300">Pending Verification</p>
                  </div>
                  <div className="h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
                </div>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Modern Header */}
      <div className="relative bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-md p-2 transition-transform group-hover:scale-110">
              <img src={bakilidLogo} alt="Bakilid Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Barangay Bakilid</span>
              <p className="text-xs text-slate-500 font-medium">Registration Portal</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
          >
            Already have an account?
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Modern Progress Section */}
        <div className="mb-10">
          <div className="text-center mb-8">
            {/* Barangay Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                <div className="relative h-28 w-28 rounded-2xl bg-white p-4 shadow-2xl shadow-blue-500/30 ring-4 ring-blue-100 border border-slate-200">
                  <img 
                    src={bakilidLogo} 
                    alt="Barangay Bakilid Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Create Your Account
            </h1>
            <p className="text-slate-600 text-lg">Step {currentStep} of 3 • {steps[currentStep - 1].title}</p>
          </div>
          
          {/* Modern Progress Steps */}
          <div className="relative flex items-center justify-between mb-8">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-slate-200 rounded-full" />
            <div 
              className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="relative flex flex-col items-center z-10">
                  <div className={`
                    flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 shadow-lg
                    ${isCompleted 
                      ? 'bg-gradient-to-br from-green-400 to-emerald-600 scale-100' 
                      : isActive 
                      ? `bg-gradient-to-br ${step.color} scale-110 ring-4 ring-white shadow-xl` 
                      : 'bg-white border-2 border-slate-300 scale-90'}
                  `}>
                    {isCompleted ? (
                      <Check className="h-8 w-8 text-white" />
                    ) : (
                      <Icon className={`h-8 w-8 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    )}
                  </div>
                  <p className={`
                    mt-3 text-sm font-semibold transition-all
                    ${isActive ? 'text-slate-900 scale-105' : isCompleted ? 'text-green-600' : 'text-slate-400'}
                  `}>
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-5 text-red-700 flex items-start gap-3 shadow-sm animate-[slideDown_0.3s_ease-out]">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-slate-200/50 space-y-6 animate-[fadeIn_0.4s_ease-out]">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Personal Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Juan"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 px-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    placeholder="Cruz"
                    value={formData.middleName}
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 px-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dela Cruz"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 px-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 px-4 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pr-4 pl-12 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="09123456789"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pr-4 pl-12 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Gmail (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      value={formData.gmail}
                      onChange={(e) => handleInputChange('gmail', e.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pr-4 pl-12 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Complete Address <span className="text-red-500">*</span>
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="House No."
                    value={formData.houseNo}
                    onChange={(e) => handleInputChange('houseNo', e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 px-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Street"
                    value={formData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 px-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Purok/Sitio"
                  value={formData.purok}
                  onChange={(e) => handleInputChange('purok', e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 px-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300"
                />
              </div>
            </div>
          )}

          {/* Step 2: Account Setup */}
          {currentStep === 2 && (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-slate-200/50 space-y-6 animate-[fadeIn_0.4s_ease-out]">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Account Setup</h2>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pr-4 pl-12 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 hover:border-slate-300"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">This will be your unique identifier</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pr-4 pl-12 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 hover:border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pr-12 pl-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 hover:border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Must include: 8+ chars, uppercase, lowercase, number & special char (@$!%*?&#)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pr-12 pl-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 hover:border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/30 p-5 mt-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-0.5 h-5 w-5 rounded-md border-2 border-slate-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 transition-all cursor-pointer"
                  />
                  <span className="text-sm text-slate-700 leading-relaxed">
                    I agree to the{" "}
                    <button type="button" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                      Terms of Service
                    </button>
                    {" "}and{" "}
                    <button type="button" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                      Privacy Policy
                    </button>
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {currentStep === 3 && (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-slate-200/50 space-y-6 animate-[fadeIn_0.4s_ease-out]">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Document Verification</h2>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Valid ID <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-3">National ID, Driver&apos;s License, Student ID, etc.</p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange('validId', e.target.files[0])}
                  className="hidden"
                  id="validId"
                />
                <label
                  htmlFor="validId"
                  className="block w-full cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-orange-50/20 p-8 text-center transition-all hover:border-orange-500 hover:bg-orange-50/30 hover:scale-[1.02] group"
                >
                  {previews.validId ? (
                    <div className="space-y-3">
                      <img src={previews.validId} alt="Valid ID" className="mx-auto h-40 w-auto rounded-xl shadow-lg" />
                      <div className="flex items-center justify-center gap-2 text-emerald-600">
                        <CheckCircle className="h-5 w-5" />
                        <p className="text-sm font-semibold">File uploaded successfully</p>
                      </div>
                      <p className="text-xs text-slate-500">Click to change</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="h-8 w-8 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-700 mb-1">Upload Valid ID</p>
                        <p className="text-xs text-slate-500">PNG, JPG or PDF • Max 5MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Proof of Residency <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-3">Barangay ID, Certificate of Residency, Utility Bill, etc.</p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange('proofOfResidency', e.target.files[0])}
                  className="hidden"
                  id="proofOfResidency"
                />
                <label
                  htmlFor="proofOfResidency"
                  className="block w-full cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50/20 p-8 text-center transition-all hover:border-blue-500 hover:bg-blue-50/30 hover:scale-[1.02] group"
                >
                  {previews.proofOfResidency ? (
                    <div className="space-y-3">
                      <img src={previews.proofOfResidency} alt="Proof of Residency" className="mx-auto h-40 w-auto rounded-xl shadow-lg" />
                      <div className="flex items-center justify-center gap-2 text-emerald-600">
                        <CheckCircle className="h-5 w-5" />
                        <p className="text-sm font-semibold">File uploaded successfully</p>
                      </div>
                      <p className="text-xs text-slate-500">Click to change</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Home className="h-8 w-8 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-700 mb-1">Upload Proof of Residency</p>
                        <p className="text-xs text-slate-500">PNG, JPG or PDF • Max 5MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-5 mt-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">Verification Process</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Your documents will be reviewed by the Barangay Administrator. 
                      You&apos;ll receive a notification once your account is verified.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modern Navigation Buttons */}
          <div className="flex gap-4 pt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-8 py-4 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-400 active:scale-95 shadow-sm"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`
                group relative flex flex-1 items-center justify-center gap-2 rounded-xl py-4 px-8 text-base font-semibold text-white shadow-xl transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50
                ${currentStep === 1 ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/30' : ''}
                ${currentStep === 2 ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/30' : ''}
                ${currentStep === 3 ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-orange-500/30' : ''}
              `}
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Processing...</span>
                </>
              ) : currentStep === 3 ? (
                <>
                  <span>Submit Registration</span>
                  <CheckCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <p className="text-slate-500">© 2026 Barangay Bakilid. All rights reserved.</p>
            <div className="flex items-center gap-2 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-medium">Secure & Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
