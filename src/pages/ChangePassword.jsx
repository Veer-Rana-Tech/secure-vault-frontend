import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      // Call API to change password (we'll need to add this to backend)
      await authService.changePassword(formData.currentPassword, formData.newPassword);

      toast.success('Password changed successfully! Please login with your new password.');

      // Logout user and redirect to login
      logout(navigate);

    } catch (error) {
      console.error('Password change failed:', error);
      toast.error(error.response?.data?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Change Password</h1>
            <p className="text-lg text-slate-600">Update your account password securely.</p>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="container mx-auto px-4 py-10 max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Current Password */}
            <div>
              <label className="block text-base font-semibold text-slate-700 mb-3">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your current password"
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-base font-semibold text-slate-700 mb-3">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 placeholder-slate-400"
                placeholder="Enter your new password"
                required
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-base font-semibold text-slate-700 mb-3">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 placeholder-slate-400"
                placeholder="Confirm your new password"
                required
              />
            </div>

             {/* Submit Button */}
             <button
               type="submit"
               disabled={loading}
               className="w-full px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 hover:scale-105 transition-all disabled:opacity-50 font-semibold text-lg"
             >
               {loading ? 'Changing Password...' : 'Change Password'}
             </button>

             {/* Cancel Button */}
             <button
               type="button"
               onClick={() => navigate('/dashboard')}
               className="w-full px-8 py-3 bg-slate-500 text-white rounded-2xl hover:bg-slate-600 hover:scale-105 transition-all font-medium"
             >
               Cancel
             </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;