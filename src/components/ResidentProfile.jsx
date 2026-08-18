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
  IdCard
} from 'lucide-react';
import { residentsAPI } from '../services/api';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';

function ResidentProfile({ user }) {
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
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{error}</h3>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const resident = profileData?.resident;
  const fullName = resident 
    ? `${resident.firstName} ${resident.middleName ? resident.middleName + ' ' : ''}${resident.lastName}`
    : user?.fullName || user?.username;
  
  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30">
            {getInitials(fullName)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{fullName}</h2>
            <p className="text-blue-100 mb-2">@{user?.username}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                <UserCircle2 className="w-4 h-4" />
                {user?.role === 'resident' ? 'Resident' : user?.role}
              </span>
              {user?.isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/90 rounded-full text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/90 rounded-full text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  Pending Verification
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-blue-50">
              Manage your account information and resident profile
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <IdCard className="w-5 h-5 text-blue-600" />
              Personal Information
            </h3>
            <button
              onClick={() => setShowEditModal(true)}
              className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium text-sm flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
          
          <div className="space-y-4">
            {resident ? (
              <>
                <InfoField 
                  icon={User} 
                  label="Full Name" 
                  value={fullName} 
                />
                <InfoField 
                  icon={User} 
                  label="Username" 
                  value={user?.username} 
                />
                <InfoField 
                  icon={Mail} 
                  label="Email Address" 
                  value={user?.email} 
                />
                <InfoField 
                  icon={Phone} 
                  label="Contact Number" 
                  value={resident.contactNumber || 'Not provided'} 
                />
                <InfoField 
                  icon={MapPin} 
                  label="Address" 
                  value={resident.address ? `${resident.address}${resident.purok ? `, Purok ${resident.purok}` : ''}` : 'Not provided'} 
                />
                <InfoField 
                  icon={Calendar} 
                  label="Date of Birth" 
                  value={formatDate(resident.birthDate)} 
                />
                <InfoField 
                  icon={User} 
                  label="Gender" 
                  value={resident.gender || 'Not provided'} 
                />
              </>
            ) : (
              <>
                <InfoField 
                  icon={User} 
                  label="Username" 
                  value={user?.username} 
                />
                <InfoField 
                  icon={Mail} 
                  label="Email Address" 
                  value={user?.email} 
                />
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Complete your resident profile to access all features
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Account Status
            </h3>
          </div>
          
          <div className="space-y-4">
            <InfoField 
              icon={UserCircle2} 
              label="Account Type" 
              value={user?.role === 'resident' ? 'Resident' : user?.role} 
            />
            
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Verification Status
              </label>
              {user?.isVerified ? (
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-green-900">Verified</p>
                    <p className="text-sm text-green-700 mt-1">
                      Your resident account has been verified
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-900">Verification Required</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your account is pending verification by barangay staff
                    </p>
                  </div>
                </div>
              )}
            </div>

            <InfoField 
              icon={Calendar} 
              label="Account Created" 
              value={formatDate(user?.createdAt)} 
            />

            {resident && resident.verificationStatus && (
              <InfoField 
                icon={Shield} 
                label="Resident Status" 
                value={
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                    resident.verificationStatus === 'verified' 
                      ? 'bg-green-100 text-green-800' 
                      : resident.verificationStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {resident.verificationStatus.charAt(0).toUpperCase() + resident.verificationStatus.slice(1)}
                  </span>
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      {resident && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Profile Completion</h3>
            <span className="text-2xl font-bold text-blue-600">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {profileCompletion === 100 
              ? 'Your profile is complete!' 
              : 'Complete your profile to keep your resident information up to date'}
          </p>
        </div>
      )}

      {/* Security Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Security
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-600">Your password is protected</p>
            </div>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium text-sm flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Change Password
            </button>
          </div>
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

function InfoField({ icon: Icon, label, value }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </label>
      <p className="text-gray-900 font-medium">
        {typeof value === 'string' ? value : value}
      </p>
    </div>
  );
}

export default ResidentProfile;
