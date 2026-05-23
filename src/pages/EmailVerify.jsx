import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const EmailVerify = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  // Get email from logged-in user or registration session
  const email = user?.email || sessionStorage.getItem('registrationEmail') || '';

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!email) {
      toast.error('Email is required. Please register or login again.');
      return;
    }
    setSendingOtp(true);
    try {
      await authService.sendVerifyOtp(email);
      toast.success('OTP sent to your email! Please check your inbox.');
      setCountdown(60); // 60 seconds countdown
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      toast.error(message);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (!email) {
      toast.error('Email is required. Please register or login again.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Verify OTP with email
      await authService.verifyOtp(email, otpString);

      setSuccess(true);
      toast.success('Email verified successfully! Please login with your credentials.');
      // Clear registration email from storage
      sessionStorage.removeItem('registrationEmail');
      setTimeout(() => {
        // Redirect to login page after verification
        navigate('/login');
      }, 2000);
    } catch (err) {
      const message = err.response?.data?.message || 'Verification failed. Please check your OTP.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 border border-gray-200"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <i className="bi bi-envelope-check text-white text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600">
            {showOtpForm
              ? 'Enter the 6-digit code sent to your email.'
              : 'Verify your email to unlock your secure vault features.'}
          </p>
        </motion.div>

        {success ? (
          <motion.div
            className="text-center"
            variants={itemVariants}
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <i className="bi bi-check-circle text-green-600 text-4xl mb-2"></i>
              </motion.div>
              <h3 className="text-green-800 font-semibold text-lg mb-2">
                Email Verified!
              </h3>
              <p className="text-green-700">
                Your email has been verified successfully!
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              Redirecting to dashboard...
            </p>
          </motion.div>
        ) : !showOtpForm ? (
          <motion.div
            className="space-y-4"
            variants={itemVariants}
          >
            <Button
              onClick={() => {
                handleSendOtp();
                setShowOtpForm(true);
              }}
              disabled={sendingOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {sendingOtp ? 'Sending OTP...' : 'Send Verification Code'}
            </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  sessionStorage.removeItem('registrationEmail');
                  navigate('/');
                }}
                className="w-full"
              >
                Skip for Later
              </Button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleVerify}
            className="space-y-6"
            variants={itemVariants}
          >
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-4 text-center">
                Enter 6-digit OTP
              </label>
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold bg-white text-gray-900 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200 outline-none"
                    maxLength="1"
                    disabled={loading}
                  />
                ))}
              </div>
              {error && (
                <motion.p
                  className="text-red-600 text-sm mt-2 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                disabled={loading || otp.some(digit => !digit)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('registrationEmail');
                    navigate('/');
                  }}
                  className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
                >
                  Skip for Now
                </button>
              </div>

              {countdown > 0 ? (
                <p className="text-center text-sm text-gray-500">
                  Resend OTP in {countdown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {sendingOtp ? 'Sending...' : 'Resend OTP'}
                </button>
              )}
            </div>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default EmailVerify;