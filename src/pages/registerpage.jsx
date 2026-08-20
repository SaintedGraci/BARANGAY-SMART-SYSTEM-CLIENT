import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Eye, EyeOff, User, Mail, ArrowRight, ArrowLeft, ShieldCheck, Upload, 
  CheckCircle, Calendar, Phone, MapPin, Home, AlertCircle, Check 
} from "lucide-react";
import bakilidLogo from "../assets/bakilidlogo.png";
import axios from "axios";
import { Turnstile } from "@marsidev/react-turnstile";
import { TURNSTILE_SITE_KEY, isTurnstileAvailable } from "../config/turnstile";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // Review/Confirmation states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStep, setReviewStep] = useState(0); // 0 = no review, 1 = review step 1, 2 = review step 2
  
  // Email verification states
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  
  // Turnstile state
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef(null);
  
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
    if (!formData.houseNo || !formData.street || !formData.purok) {
      setError("Complete address is required");
      return false;
    }
    return true;
  };

  // Email verification handlers
  const handleSendVerificationCode = async () => {
    if (!formData.gmail) {
      setError("Please enter your Gmail address first");
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.gmail)) {
      setError("Please enter a valid Gmail address");
      return;
    }

    setIsSendingCode(true);
    setError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/email-verification/send-code`, {
        email: formData.gmail,
        name: formData.firstName || 'User'
      });

      setEmailVerificationSent(true);
      setVerificationMessage(response.data.message);
      setTimeout(() => setVerificationMessage(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setIsVerifyingCode(true);
    setError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/email-verification/verify-code`, {
        email: formData.gmail,
        code: verificationCode
      });

      setEmailVerified(true);
      setVerificationMessage(response.data.message);
      setTimeout(() => setVerificationMessage(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const validateStep2 = () => {
    if (!formData.username || formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError("Username can only contain letters, numbers, and underscores");
      return false;
    }
    if (formData.gmail && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.gmail)) {
      setError("Please enter a valid Gmail address");
      return false;
    }
    if (formData.gmail && !emailVerified) {
      setError("Please verify your Gmail address before continuing");
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

  const handleSubmitStep3 = () => {
    if (validateStep3()) {
      setReviewStep(3);
      setShowReviewModal(true);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setReviewStep(1);
      setShowReviewModal(true);
    } else if (currentStep === 2 && validateStep2()) {
      setReviewStep(2);
      setShowReviewModal(true);
    }
  };

  const handleConfirmAndProceed = () => {
    setShowReviewModal(false);
    if (reviewStep === 3) {
      // Final submission
      handleFinalSubmit();
    } else {
      setCurrentStep(currentStep + 1);
      setReviewStep(0);
    }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    setError("");

    if (!turnstileToken) {
      setError("Please complete the verification challenge");
      setIsLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('username', formData.username);
      submitData.append('email', formData.gmail || `${formData.username}@bakilid.local`);
      submitData.append('password', formData.password);
      submitData.append('firstName', formData.firstName);
      submitData.append('middleName', formData.middleName);
      submitData.append('lastName', formData.lastName);
      submitData.append('gender', formData.gender);
      submitData.append('birthDate', formData.birthDate);
      submitData.append('contactNumber', formData.contactNumber);
      submitData.append('address', `${formData.houseNo}, ${formData.street}`);
      submitData.append('purok', formData.purok);
      submitData.append('validId', formData.validId);
      submitData.append('proofOfResidency', formData.proofOfResidency);
      submitData.append('turnstileToken', turnstileToken);

      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/register`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setRegistrationSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setTurnstileToken("");
      turnstileRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDetails = () => {
    setShowReviewModal(false);
    setReviewStep(0);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleSubmitStep3();
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Account", icon: ShieldCheck },
    { number: 3, title: "Verification", icon: Upload }
  ];

  // Review Modal Component
  const ReviewModal = () => {
    if (!showReviewModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-4 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden rounded-t-2xl sm:rounded-2xl border-t sm:border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="border-b border-slate-200 bg-slate-50 px-4 sm:px-6 py-4 sm:py-5 sticky top-0 z-10">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Review Your Information
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Please verify all details are correct before proceeding
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[calc(90vh-180px)] sm:max-h-[calc(85vh-180px)] overflow-y-auto p-4 sm:p-6">
            {reviewStep === 1 && (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">First Name</p>
                      <p className="font-medium text-slate-900">{formData.firstName}</p>
                    </div>
                    {formData.middleName && (
                      <div>
                        <p className="text-xs text-slate-500">Middle Name</p>
                        <p className="font-medium text-slate-900">{formData.middleName}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-500">Last Name</p>
                      <p className="font-medium text-slate-900">{formData.lastName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Gender</p>
                      <p className="font-medium text-slate-900">{formData.gender}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Date of Birth</p>
                      <p className="font-medium text-slate-900">{formData.birthDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Mobile Number</p>
                      <p className="font-medium text-slate-900">{formData.contactNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address Information
                  </h4>
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">
                      {formData.houseNo}, {formData.street}
                    </p>
                    <p className="text-slate-600 mt-1">{formData.purok}</p>
                    <p className="text-slate-500 text-xs mt-1">Barangay Bakilid, Mandaue City</p>
                  </div>
                </div>
              </div>
            )}

            {reviewStep === 2 && (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Account Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Username</p>
                      <p className="font-medium text-slate-900">{formData.username}</p>
                    </div>
                    {formData.gmail && (
                      <div>
                        <p className="text-xs text-slate-500">Gmail</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900 truncate">{formData.gmail}</p>
                          {emailVerified && (
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-500">Password</p>
                      <p className="font-medium text-slate-900">••••••••</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Ready to proceed?</p>
                      <p className="text-xs text-blue-700 mt-1">
                        After confirming, you'll upload your verification documents in the next step.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {reviewStep === 3 && (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Uploaded Documents
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Valid ID</p>
                      {previews.validId && (
                        <div className="relative rounded-lg overflow-hidden border border-slate-200">
                          <img src={previews.validId} alt="Valid ID Preview" className="w-full h-48 object-contain bg-slate-50" />
                          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium">
                            <Check className="h-3 w-3" />
                            Uploaded
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Proof of Residency</p>
                      {previews.proofOfResidency && (
                        <div className="relative rounded-lg overflow-hidden border border-slate-200">
                          <img src={previews.proofOfResidency} alt="Proof of Residency Preview" className="w-full h-48 object-contain bg-slate-50" />
                          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium">
                            <Check className="h-3 w-3" />
                            Uploaded
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">Final Step</p>
                      <p className="text-xs text-amber-700 mt-1">
                        By submitting, your registration will be sent to the Barangay Administrator for verification. 
                        You'll be notified once your account is approved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-200 bg-white px-4 sm:px-6 py-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={handleEditDetails}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-lg border-2 border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-all touch-manipulation min-h-[44px]"
            >
              Edit Details
            </button>
            <button
              type="button"
              onClick={handleConfirmAndProceed}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 touch-manipulation min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Submitting...</span>
                </>
              ) : reviewStep === 3 ? (
                <>
                  Submit Registration
                  <CheckCircle className="h-4 w-4" />
                </>
              ) : (
                <>
                  Confirm & Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <ReviewModal />
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-10">
              {/* Success Icon */}
              <div className="flex justify-center mb-8">
                <div className="h-20 w-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" strokeWidth={2} />
                </div>
              </div>

              {/* Main Content */}
              <div className="text-center space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Registration Submitted</h2>
                  <p className="text-lg text-slate-600">Thank you for registering with Barangay Bakilid</p>
                </div>

                {/* Status Card */}
                <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide">Current Status</p>
                        <p className="text-base font-bold text-amber-700">Pending Verification</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '0.15s' }} />
                      <div className="h-2 w-2 rounded-full bg-amber-300 animate-pulse" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                  <p className="text-sm text-amber-900/80 leading-relaxed">
                    Your account is currently under review by the Barangay Administrator. You will receive a notification once your account has been verified and activated.
                  </p>
                </div>

                {/* Information Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-left space-y-3">
                  <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">What happens next?</h3>
                  <div className="space-y-2.5 text-sm text-slate-600">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      </div>
                      <p>The administrator will review your submitted documents</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      </div>
                      <p>You will be notified via email once verification is complete</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      </div>
                      <p>After approval, you can log in using your credentials</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate('/login')}
                  className="w-full mt-8 rounded-lg bg-slate-900 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-[0.98]"
                >
                  Go to Login Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Review Modal */}
      <ReviewModal />
      
      {/* Clean Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 sm:gap-3 group"
          >
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-white border border-slate-200 p-2 transition-all group-hover:border-slate-300">
              <img src={bakilidLogo} alt="Bakilid Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-semibold text-slate-900">Barangay Bakilid</span>
              <p className="text-[10px] sm:text-xs text-slate-500">Registration Portal</p>
            </div>
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
          >
            <span className="hidden sm:inline">Already have an account?</span>
            <span className="sm:hidden">Sign in</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Progress Section */}
        <div className="mb-8 sm:mb-10">
          <div className="text-center mb-6 sm:mb-8">
            {/* Barangay Logo */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg bg-white border-2 border-slate-200 p-3 sm:p-4 shadow-sm">
                <img 
                  src={bakilidLogo} 
                  alt="Barangay Bakilid Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-3">
              Create Your Account
            </h1>
            <p className="text-slate-600 text-base sm:text-lg">Step {currentStep} of 3</p>
          </div>
          
          {/* Progress Steps */}
          <div className="relative flex items-center justify-between mb-6 sm:mb-8 px-2">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-slate-200" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-slate-900 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="relative flex flex-col items-center z-10">
                  <div className={`
                    relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-all duration-300 border-4 bg-white
                    ${isCompleted 
                      ? 'border-slate-900' 
                      : isActive 
                      ? 'border-slate-900' 
                      : 'border-slate-200'}
                  `}>
                    {isCompleted ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-slate-900 flex items-center justify-center">
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" strokeWidth={3} />
                        </div>
                      </div>
                    ) : (
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} strokeWidth={2} />
                    )}
                  </div>
                  <p className={`
                    mt-2 sm:mt-3 text-xs sm:text-sm font-semibold transition-all text-center
                    ${isActive ? 'text-slate-900' : isCompleted ? 'text-slate-900' : 'text-slate-400'}
                  `}>
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-4 sm:space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 text-red-800 flex items-start gap-2 sm:gap-3">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Personal Information</h2>
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
            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Account Setup</h2>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-0 hover:border-slate-400"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">This will be your unique identifier</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  Gmail Address <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-2">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Add your Gmail to receive instant notifications about document requests, announcements, and account updates.
                  </p>
                </div>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.gmail}
                    onChange={(e) => {
                      handleInputChange('gmail', e.target.value);
                      setEmailVerificationSent(false);
                      setEmailVerified(false);
                      setVerificationCode('');
                    }}
                    disabled={emailVerified}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-0 hover:border-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                  {emailVerified && (
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-2 text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>

                {/* Send Verification Code Button */}
                {formData.gmail && !emailVerificationSent && !emailVerified && (
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode}
                    className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingCode ? 'Sending...' : 'Send Verification Code'}
                  </button>
                )}

                {/* Verification Code Input */}
                {emailVerificationSent && !emailVerified && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Enter 6-Digit Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength="6"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 rounded-lg border border-slate-300 bg-white py-2.5 px-4 text-center text-lg font-mono tracking-wider outline-none transition-all focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-0"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={isVerifyingCode || verificationCode.length !== 6}
                        className="px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isVerifyingCode ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleSendVerificationCode}
                      disabled={isSendingCode}
                      className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                    >
                      Resend Code
                    </button>
                  </div>
                )}

                {verificationMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">{verificationMessage}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-12 pl-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-0 hover:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Minimum 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-12 pl-4 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-0 hover:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mt-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-0 transition-all cursor-pointer"
                  />
                  <span className="text-sm text-slate-700 leading-relaxed">
                    I agree to the{" "}
                    <button type="button" onClick={() => window.open('/terms', '_blank')} className="text-slate-900 font-medium hover:underline">
                      Terms of Service
                    </button>
                    {" "}and{" "}
                    <button type="button" onClick={() => window.open('/privacy', '_blank')} className="text-slate-900 font-medium hover:underline">
                      Privacy Policy
                    </button>
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {currentStep === 3 && (
            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Document Verification</h2>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
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
                  className="block w-full cursor-pointer rounded-lg border-2 border-dashed border-slate-300 bg-white p-8 text-center transition-all hover:border-slate-900 hover:bg-slate-50 group"
                >
                  {previews.validId ? (
                    <div className="space-y-3">
                      <img src={previews.validId} alt="Valid ID" className="mx-auto h-40 w-auto rounded-lg" />
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <p className="text-sm font-medium">File uploaded successfully</p>
                      </div>
                      <p className="text-xs text-slate-500">Click to change</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="mx-auto h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <Upload className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Upload Valid ID</p>
                        <p className="text-xs text-slate-500">PNG, JPG or PDF • Max 5MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
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
                  className="block w-full cursor-pointer rounded-lg border-2 border-dashed border-slate-300 bg-white p-8 text-center transition-all hover:border-slate-900 hover:bg-slate-50 group"
                >
                  {previews.proofOfResidency ? (
                    <div className="space-y-3">
                      <img src={previews.proofOfResidency} alt="Proof of Residency" className="mx-auto h-40 w-auto rounded-lg" />
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <p className="text-sm font-medium">File uploaded successfully</p>
                      </div>
                      <p className="text-xs text-slate-500">Click to change</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="mx-auto h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <Home className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Upload Proof of Residency</p>
                        <p className="text-xs text-slate-500">PNG, JPG or PDF • Max 5MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-slate-900/5 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Verification Process</p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Your documents will be reviewed by the Barangay Administrator. 
                      You&apos;ll receive a notification once your account is verified.
                    </p>
                  </div>
                </div>
              </div>

              {/* Turnstile CAPTCHA */}
              <div className="mt-6">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-4 w-4" />
                  Security Verification <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-center">
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
                    />
                  ) : (
                    <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600 font-medium">Security verification unavailable</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 pt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-8 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-400 active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex flex-1 items-center justify-center gap-2 rounded-lg py-3 px-8 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Processing...</span>
                </>
              ) : currentStep === 3 ? (
                <>
                  <span>Submit Registration</span>
                  <CheckCircle className="h-4 w-4 transition-transform group-hover:scale-110" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <p className="text-slate-500">© 2026 Barangay Bakilid. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-medium">Secure & Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
