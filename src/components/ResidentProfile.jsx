import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  CheckCircle2, 
  AlertCircle,
  Edit3,
  Lock,
  UserCircle2,
  IdCard,
  Sparkles,
  RefreshCw,
  KeyRound,
  FileCheck
} from 'lucide-react';
import { residentsAPI } from '../services/api';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { cn } from '../lib/utils';

export default function ResidentProfile({ user }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await residentsAPI.getMyProfile();
      setProfileData(response.data.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Unable to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    await residentsAPI.updateMyProfile(updatedData);
    await fetchProfile();
  };

  const handleChangePassword = async (passwordData) => {
    await residentsAPI.changePassword(passwordData);
  };

  const calculateProfileCompletion = () => {
    if (!profileData?.resident) return 0;
    
    const resident = profileData.resident;
    const fields = [
      resident.firstName,
      resident.lastName,
      resident.birthDate,
      resident.gender,
      resident.contactNumber,
      resident.address,
      resident.purok,
      resident.citizenship,
      resident.middleName
    ];
    
    const filledFields = fields.filter(field => field && field.toString().trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getInitials = (name) => {
    if (!name) return user?.username?.charAt(0).toUpperCase() || 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Loading skeleton using shadcn Cards
  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Card className="animate-pulse bg-slate-50 border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-slate-200 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-slate-200 rounded w-48" />
                <div className="h-4 bg-slate-200 rounded w-32" />
                <div className="h-5 bg-slate-200 rounded w-64 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-pulse">
            <CardHeader><div className="h-5 bg-slate-200 rounded w-40" /></CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardHeader><div className="h-5 bg-slate-200 rounded w-40" /></CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="max-w-xl mx-auto my-8 border-red-200 bg-red-50/50">
        <CardContent className="p-8 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">{error}</h3>
          <p className="text-sm text-slate-600 mb-6">Something went wrong loading your resident profile.</p>
          <button
            onClick={fetchProfile}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </CardContent>
      </Card>
    );
  }

  const resident = profileData?.resident;
  const fullName = resident 
    ? `${resident.firstName} ${resident.middleName ? resident.middleName + ' ' : ''}${resident.lastName}`
    : user?.fullName || user?.username;
  
  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="space-y-6 w-full">
      {/* Profile Header Banner */}
      <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent)]" />
        <CardContent className="p-6 sm:p-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
            {/* Avatar */}
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-white/30 shadow-xl shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-600 text-white font-extrabold text-2xl sm:text-3xl">
                {getInitials(fullName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    {fullName}
                  </h1>
                  <p className="text-emerald-100 text-sm font-medium">@{user?.username}</p>
                </div>
                
                {/* Edit Button Header Action */}
                <button
                  onClick={() => setShowEditModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md border border-white/20 transition-all duration-200 shadow-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-3 py-1 text-xs">
                  <UserCircle2 className="w-3.5 h-3.5" />
                  {user?.role === 'resident' ? 'Resident Account' : user?.role}
                </Badge>

                {user?.isVerified ? (
                  <Badge variant="success" className="bg-emerald-500/90 text-white border-emerald-400/30 px-3 py-1 text-xs shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Resident
                  </Badge>
                ) : (
                  <Badge variant="warning" className="bg-amber-500/90 text-white border-amber-400/30 px-3 py-1 text-xs shadow-sm">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Pending Verification
                  </Badge>
                )}
              </div>

              <p className="mt-3 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Official resident dashboard for Barangay Bakilid. Keep your personal profile and documentation status current.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Meter Card */}
      {resident && (
        <Card className="border-emerald-100 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-white shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Profile Completion</h3>
                  <p className="text-xs text-slate-500">
                    {profileCompletion === 100 
                      ? 'Your profile details are complete!' 
                      : 'Complete all details for faster barangay certificate requests.'}
                  </p>
                </div>
              </div>
              <span className="text-xl font-extrabold text-emerald-600">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2.5" />
          </CardContent>
        </Card>
      )}

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Personal Information */}
        <Card>
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <IdCard className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your registered resident details</CardDescription>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                title="Edit Personal Info"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-5 space-y-4">
            {resident ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem icon={User} label="Full Name" value={fullName} fullWidth />
                <InfoItem icon={User} label="Username" value={user?.username} />
                <InfoItem icon={Mail} label="Email Address" value={user?.email} />
                <InfoItem icon={Phone} label="Contact Number" value={resident.contactNumber || 'Not provided'} />
                <InfoItem icon={MapPin} label="Address" value={resident.address ? `${resident.address}${resident.purok ? `, Purok ${resident.purok}` : ''}` : 'Not provided'} fullWidth />
                <InfoItem icon={Calendar} label="Date of Birth" value={formatDate(resident.birthDate)} />
                <InfoItem icon={User} label="Gender" value={resident.gender || 'Not provided'} />
                <InfoItem icon={FileCheck} label="Citizenship" value={resident.citizenship || 'Filipino'} />
              </div>
            ) : (
              <div className="space-y-4">
                <InfoItem icon={User} label="Username" value={user?.username} />
                <InfoItem icon={Mail} label="Email Address" value={user?.email} />
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Please complete your resident details by clicking <strong>Edit Profile</strong> to unlock document requests.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account & Security Stack */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Account Status</CardTitle>
                  <CardDescription>Verification & access level</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Type</span>
                <Badge variant="secondary" className="capitalize font-bold">
                  {user?.role === 'resident' ? 'Resident' : user?.role}
                </Badge>
              </div>

              {/* Verification Status Card */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                  Verification Status
                </label>
                {user?.isVerified ? (
                  <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-emerald-900">Verified Resident</p>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        Your account has been officially verified by Barangay Bakilid staff.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-amber-900">Verification Pending</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Your submitted documents are currently under review by barangay personnel.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Joined Date</span>
                  <span className="text-xs font-bold text-slate-800">{formatDate(user?.createdAt)}</span>
                </div>

                {resident?.verificationStatus && (
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Resident Record</span>
                    <Badge variant={
                      resident.verificationStatus === 'verified' ? 'success' :
                      resident.verificationStatus === 'pending' ? 'warning' : 'destructive'
                    } className="capitalize text-[11px]">
                      {resident.verificationStatus}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card>
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Security & Password</CardTitle>
                  <CardDescription>Keep your account secure</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-5">
              <div className="flex items-center justify-between p-4 border border-slate-200/80 rounded-xl hover:border-emerald-300 transition-colors bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">Password</p>
                    <p className="text-xs text-slate-500">Encrypted and protected</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Change
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profileData={profileData}
        onUpdate={handleUpdateProfile}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onChangePassword={handleChangePassword}
      />
    </div>
  );
}

// Subcomponent for info fields
function InfoItem({ icon: Icon, label, value, fullWidth = false }) {
  return (
    <div className={cn("p-3 rounded-xl bg-slate-50/80 border border-slate-200/60", fullWidth && "sm:col-span-2")}>
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3 text-slate-400" />}
        {label}
      </label>
      <div className="text-sm font-semibold text-slate-900 break-words">
        {typeof value === 'string' ? value : value}
      </div>
    </div>
  );
}
