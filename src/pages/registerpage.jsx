import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, ArrowRight, ArrowLeft, ShieldCheck, Upload, CheckCircle, Calendar, Phone, MapPin, Home } from "lucide-react";
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
    // Step 1: Personal Information
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    contactNumber: "",
    houseNo: "",
    street: "",
    purok: "",
    
    // Step 2: Account Setup
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Step 3: Verification
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
    if (!formData.birthDate) {
      setError("Date of birth is required");
      return false;
    }
    if (!formData.contactNumber || formData.contactNumber.length < 10) {
      setError("Valid mobile number is required");
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
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters");
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
      submitData.append('birthDate', formData.birthDate);
      submitData.append('contactNumber', formData.contactNumber);
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
    { number: 1, title: "Personal Information", icon: User },
    { number: 2, title: "Account Setup", icon: ShieldCheck },
    { number: 3, title: "Verification", icon: Upload }
  ];

  if (registrationSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/50 p-8 text-center backdrop-blur-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-white">Registration Submitted!</h2>
            <div className="mb-6 space-y-2">
              <p className="text-slate-300">Your registration has been submitted successfully.</p>
              <p className="text-sm text-slate-400">
                Please wait for the Barangay Administrator to verify your account.
              </p>
            </div>
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 mb-6">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Status</p>
              <p className="text-sm text-amber-300">Pending Verification</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-95"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <div className="flex w-full flex-col justify-between p-6 sm:p-8 md:max-w-2xl lg:p-12">
        
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg p-1">
            <img src={bakilidLogo} alt="Bakilid Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Barangay Bakilid
            </span>
            <span className="ml-1 text-xs font-semibold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded-md">
              Smart Portal
            </span>
          </div>
        </button>

        <div className="my-auto w-full max-w-lg self-center py-8">
          <div className="space-y-3 mb-8">
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-sm text-slate-400">Step {currentStep} of 3 - {steps[currentStep - 1].title}</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-between">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`
                      flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all
                      ${isCompleted ? 'bg-emerald-500 border-emerald-500' : 
                        isActive ? 'bg-sky-500 border-sky-500' : 
                        'bg-slate-800 border-slate-700'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : (
                        <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${isActive ? 'text-white' : 'text-slate-500'}`}>
                      Step {step.number}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 -mt-6 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Juan"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-sky-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-sky-500/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      placeholder="Cruz"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-sky-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-sky-500/10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dela Cruz"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-sky-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-sky-500/10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="date"
                      required
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pr-4 pl-11 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-sky-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-sky-500/10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="09123456789"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pr-4 pl-11 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-sky-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-sky-500/10"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Complete Address *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="House No."
                      value={formData.houseNo}
                      onChange={(e) => handleInputChange('houseNo', e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-sky-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-sky-500/10"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Street"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-sky-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-sky-500/10"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Purok/Sitio"
                    value={formData.purok}
                    onChange={(e) => handleInputChange('purok', e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-sky-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-sky-500/10"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Account Setup */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Username *
                  </label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pr-4 pl-11 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-sky-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-sky-500/10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pr-4 pl-11 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-sky-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-sky-500/10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pr-11 pl-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-sky-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-sky-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pr-11 pl-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-sky-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-sky-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-0"
                    />
                    <span className="text-xs text-slate-400 leading-relaxed">
                      I agree to the <button type="button" className="text-sky-400 hover:underline">Terms of Service</button> and{" "}
                      <button type="button" className="text-sky-400 hover:underline">Privacy Policy</button>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Verification */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Valid ID *
                  </label>
                  <p className="text-xs text-slate-500 mb-2">National ID, Driver's License, Student ID, etc.</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('validId', e.target.files[0])}
                    className="hidden"
                    id="validId"
                  />
                  <label
                    htmlFor="validId"
                    className="block w-full cursor-pointer rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/30 p-6 text-center transition-all hover:border-sky-500 hover:bg-slate-900/50"
                  >
                    {previews.validId ? (
                      <div className="space-y-2">
                        <img src={previews.validId} alt="Valid ID" className="mx-auto h-32 w-auto rounded-lg" />
                        <p className="text-xs text-emerald-400 font-medium">✓ File uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-slate-500" />
                        <p className="text-sm text-slate-400">Click to upload Valid ID</p>
                        <p className="text-xs text-slate-600">PNG, JPG or PDF (Max 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Proof of Residency *
                  </label>
                  <p className="text-xs text-slate-500 mb-2">Barangay ID, Certificate of Residency, Utility Bill, etc.</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('proofOfResidency', e.target.files[0])}
                    className="hidden"
                    id="proofOfResidency"
                  />
                  <label
                    htmlFor="proofOfResidency"
                    className="block w-full cursor-pointer rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/30 p-6 text-center transition-all hover:border-sky-500 hover:bg-slate-900/50"
                  >
                    {previews.proofOfResidency ? (
                      <div className="space-y-2">
                        <img src={previews.proofOfResidency} alt="Proof of Residency" className="mx-auto h-32 w-auto rounded-lg" />
                        <p className="text-xs text-emerald-400 font-medium">✓ File uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-slate-500" />
                        <p className="text-sm text-slate-400">Click to upload Proof of Residency</p>
                        <p className="text-xs text-slate-600">PNG, JPG or PDF (Max 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                  <p className="text-xs text-blue-300 leading-relaxed">
                    <strong>Note:</strong> Your documents will be verified by the Barangay Administrator. 
                    You will receive notification once your account is approved.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:opacity-95 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : currentStep === 3 ? (
                  <>
                    Submit Registration
                    <CheckCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <button 
                onClick={() => navigate('/login')}
                className="font-semibold text-slate-300 hover:text-white underline underline-offset-4 transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-900 pt-4 text-xs text-slate-500">
          <p>© 2026 Brgy. Bakilid</p>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secure Connection
          </span>
        </div>
      </div>

      {/* Right Side Info Panel */}
      <div className="relative hidden flex-1 items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 px-12 lg:flex border-l border-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative w-full max-w-md space-y-8 z-10">
          <div className="space-y-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500/10">
                      <Icon className="h-6 w-6 text-sky-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{step.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {step.number === 1 && "Provide your personal details"}
                        {step.number === 2 && "Create your login credentials"}
                        {step.number === 3 && "Upload verification documents"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
