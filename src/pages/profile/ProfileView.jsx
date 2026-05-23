import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const ProfileView = () => {
  const { user: contextUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('ProfileView: Starting profile fetch...');
        console.log('ProfileView: Context user:', contextUser);
        
        const data = await authService.getProfile();
        console.log('ProfileView: Profile data received:', data);
        
        // Ensure data is an object
        if (data && typeof data === 'object') {
          setProfile(data);
          setError(null);
        } else {
          console.warn('ProfileView: Invalid profile data received:', data);
          throw new Error('Invalid profile data');
        }
      } catch (err) {
        console.error('ProfileView: Failed to load profile:', err);
        setError(err.message || 'Failed to load profile data');
        toast.error('Failed to load profile');
        
        // Set safe fallback profile data
        const fallbackProfile = {
          name: contextUser?.name || 'User',
          email: contextUser?.email || 'user@example.com',
          userId: contextUser?.userId || 'USER001',
          isAccountVerified: contextUser?.isAccountVerified || false
        };
        console.log('ProfileView: Setting fallback profile:', fallbackProfile);
        setProfile(fallbackProfile);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a token
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      console.warn('ProfileView: No token found, using fallback');
      setProfile({
        name: contextUser?.name || 'User',
        email: contextUser?.email || 'user@example.com',
        userId: contextUser?.userId || 'USER001',
        isAccountVerified: contextUser?.isAccountVerified || false
      });
      setLoading(false);
    }
  }, [contextUser]);

  // Safe loading state - always return valid JSX
  if (loading) {
    console.log('ProfileView: Rendering loading state');
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-gray-600 font-medium">Loading your profile...</p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // Safe error state - only show if we have error and no profile
  if (error && !profile) {
    console.log('ProfileView: Rendering error state');
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <motion.div
            className="text-center max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-exclamation-triangle text-red-600 text-2xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Profile</h2>
            <p className="text-gray-600 mb-6">{error}</p>
             <div className="space-y-3">
               <button
                 onClick={() => window.location.reload()}
                 className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all"
               >
                 Try Again
               </button>
               <Link
                 to="/dashboard"
                 className="block w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 hover:scale-105 transition-all text-center"
               >
                 Back to Dashboard
               </Link>
             </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // Ensure profile exists before rendering - double safety check
  if (!profile || typeof profile !== 'object') {
    console.log('ProfileView: Profile is null or invalid, showing fallback');
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-person-circle text-blue-600 text-2xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Available</h2>
            <p className="text-gray-600 mb-6">Unable to load your profile information.</p>
             <Link
               to="/dashboard"
               className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all"
             >
               Back to Dashboard
             </Link>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  console.log('ProfileView: Rendering profile with data:', profile);

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-xl text-gray-600">
            Manage your account information and settings
          </p>
        </motion.div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information Section */}
          <motion.div
            className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-200/25 border border-white/50 p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <i className="bi bi-person-circle text-white text-sm"></i>
              </div>
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <p className="text-base text-gray-900 bg-gray-50/80 rounded-lg px-4 py-3 border border-gray-200/50">
                  {profile?.name || 'Not Provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-base text-gray-900 bg-gray-50/80 rounded-lg px-4 py-3 border border-gray-200/50">
                  {profile?.email || 'Not Provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <p className="text-base text-gray-900 bg-gray-50/80 rounded-lg px-4 py-3 border border-gray-200/50">
                  Not Provided
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <p className="text-base text-gray-900 bg-gray-50/80 rounded-lg px-4 py-3 border border-gray-200/50">
                  Not Provided
                </p>
              </div>
            </div>
          </motion.div>

          {/* Account Information Section */}
          <motion.div
            className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-200/25 border border-white/50 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <i className="bi bi-shield-check text-white text-sm"></i>
              </div>
              Account Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                <div className="flex items-center gap-2">
                  <motion.span
                    className={`px-3 py-2 rounded-full text-sm font-medium ${
                      profile?.isAccountVerified
                        ? 'bg-green-100/80 text-green-800 border border-green-200/50'
                        : 'bg-red-100/80 text-red-800 border border-red-200/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {profile?.isAccountVerified ? '✓ Verified' : '⚠ Not Verified'}
                  </motion.span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                <p className="text-base text-gray-900 bg-gray-50/80 rounded-lg px-4 py-3 border border-gray-200/50 font-mono">
                  {profile?.userId || 'Not Provided'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <p className="text-base text-gray-900 bg-gray-50/80 rounded-lg px-4 py-3 border border-gray-200/50">
                  January 2024
                </p>
              </div>
            </div>
          </motion.div>

          {/* Additional Information Section */}
          <motion.div
            className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-200/25 border border-white/50 p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <i className="bi bi-info-circle text-white text-sm"></i>
              </div>
              Additional Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <p className="text-base text-gray-900 bg-gray-50/80 rounded-lg px-4 py-3 border border-gray-200/50">
                  Not Provided
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <p className="text-base text-gray-900 bg-gray-50/80 rounded-lg px-4 py-3 border border-gray-200/50">
                  Not Provided
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <p className="text-base text-gray-900 bg-gray-50/80 rounded-lg px-4 py-3 border border-gray-200/50">
                  Not Provided
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <p className="text-base text-gray-900 bg-gray-50/80 rounded-lg px-4 py-3 border border-gray-200/50">
                  Not Provided
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="mt-8 flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            to="/profile/edit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 font-medium"
          >
            <i className="bi bi-pencil me-2"></i>
            Edit Profile
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 shadow-lg shadow-gray-500/30 hover:shadow-xl hover:shadow-gray-500/40 font-medium"
          >
            <i className="bi bi-house me-2"></i>
            Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileView;