import { useState } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const VerificationModal = ({ isOpen, onClose, onVerified }) => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const { updateUser } = useAuth();

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    setSendingOtp(true);
    try {
      await authService.sendVerifyOtp();
      toast.success('OTP sent to your email!');
      setShowOtpForm(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp(otp);
      
      // Fetch updated profile to get verification status
      const profile = await authService.getProfile();
      const updatedUser = {
        email: profile.email,
        name: profile.name,
        userId: profile.userId,
        isAccountVerified: profile.isAccountVerified
      };
      updateUser(updatedUser);
      
      toast.success('Email verified successfully!');
      onVerified();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
         <div className="text-center mb-6">
           <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <i className="bi bi-envelope-check text-white text-3xl"></i>
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
           <p className="text-gray-600 mb-2">
             {showOtpForm 
               ? 'Enter the OTP sent to your email' 
               : 'Verify your email to access all features'}
           </p>
         </div>

        {!showOtpForm ? (
          <div className="space-y-3">
            <button
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sendingOtp ? (
                <>
                  <span className="spinner-border spinner-border-sm"></span>
                  Sending OTP...
                </>
              ) : (
                <>
                  <i className="bi bi-send"></i>
                  Verify Email Now
                </>
              )}
            </button>
            <button
              onClick={handleSkip}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 hover:scale-105 transition-all"
            >
              Skip for Later
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="w-full text-gray-600 py-2 rounded-lg font-medium hover:text-gray-800 hover:scale-105 transition-all"
              >
                Skip for Now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerificationModal;