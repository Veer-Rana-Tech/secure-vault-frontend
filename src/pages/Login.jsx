import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password, navigate);
    console.log("TOKEN AFTER LOGIN:", localStorage.getItem("token"));
    setLoading(false);

    // Navigation is now handled by the login function
    // No need for additional navigation logic here
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
        type: 'spring',
        stiffness: 100
      }
    })
  };

  const floatingVariants = (duration) => ({
    animate: {
      y: [0, -15, 0],
      transition: {
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  });

  const illustration = (
    <div className="relative h-full flex flex-col justify-between overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />

      {/* Animated floating shapes */}
      <motion.div
        className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-24 h-24 bg-purple-300/10 rounded-full blur-2xl"
        animate={{ y: [0, 20, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Content */}
      <div className="relative z-10 p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <motion.div
            className="w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl flex items-center justify-center shadow-lg shadow-white/20"
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <i className="bi bi-shield-lock text-white text-xl"></i>
          </motion.div>
          <div>
            <span className="text-white text-2xl font-bold">Authify</span>
            <p className="text-white/70 text-xs">Secure Vault</p>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-12 pb-12 space-y-4">
        {[
          { icon: 'bi-shield-check', title: 'Enterprise Security', desc: 'Bank-grade encryption', gradient: 'from-blue-600 to-blue-700' },
          { icon: 'bi-lightning-charge', title: 'Lightning Fast', desc: 'Instant file uploads', gradient: 'from-amber-600 to-amber-700' },
          { icon: 'bi-people-fill', title: 'Team Collaboration', desc: 'Share securely', gradient: 'from-rose-600 to-rose-700' }
        ].map((feature, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={featureVariants}
            initial="hidden"
            animate="visible"
            className="group rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 hover:bg-white/15 hover:border-white/30 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <motion.div
                className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <i className={`bi ${feature.icon} text-lg`}></i>
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                <p className="text-xs text-white/70 mt-0.5">{feature.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom accent */}
      <div className="relative z-10 px-12 pb-8">
        <motion.div
          className="flex items-center gap-2 text-white/80 text-sm"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span>Protected by 256-bit encryption</span>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Premium background animation */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-300 to-transparent rounded-full blur-3xl opacity-20"
          animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 right-1/4 w-80 h-80 bg-gradient-to-tr from-indigo-300 to-transparent rounded-full blur-3xl opacity-15"
          animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <AuthLayout illustration={illustration}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Premium glassmorphic card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 w-full border border-white/40 shadow-2xl shadow-blue-200/20">
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100/70 to-indigo-100/70 text-blue-600 shadow-lg shadow-blue-200/30 border border-white/50 backdrop-blur-sm"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                whileHover={{ scale: 1.08 }}
              >
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15v2" />
                  <path d="M6 19h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  <path d="M10 11V7a2 2 0 114 0v4" />
                </svg>
              </motion.div>
              <motion.h1
                className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Welcome Back
              </motion.h1>
              <motion.p
                className="mt-2 text-gray-600 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Access your secure vault
              </motion.p>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="you@example.com"
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                showPasswordToggle
                required
              />

              <motion.div
                className="flex justify-between items-center pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                </label>
                <Link
                  to="/reset-password"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                >
                  Forgot Password?
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </motion.div>
            </motion.form>

            {/* Divider */}
            <motion.div
              className="mt-8 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/60"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white/80 text-gray-600 backdrop-blur-sm">Or continue with</span>
              </div>
            </motion.div>

            {/* Social buttons */}
            <motion.div
              className="mt-6 flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { icon: 'bi-google', label: 'Google' },
                { icon: 'bi-github', label: 'GitHub' }
              ].map((btn, i) => (
                <motion.button
                  key={i}
                  className="flex-1 py-2.5 border border-gray-200/60 rounded-xl hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 transition-all backdrop-blur-sm hover:border-blue-200/60 hover:shadow-md hover:shadow-blue-100/20 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <i className={`bi ${btn.icon} text-gray-600`}></i>
                  <span className="text-sm text-gray-600">{btn.label}</span>
                </motion.button>
              ))}
            </motion.div>

            {/* Sign up link */}
            <motion.div
              className="mt-6 text-center text-gray-600 border-t border-gray-200/60 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                >
                  Create one
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AuthLayout>
    </div>
  );
};

export default Login;
