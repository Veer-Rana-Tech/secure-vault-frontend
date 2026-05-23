import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';

const Home = () => {
  const { user: _user } = useAuth();

  const features = [
    {
      icon: 'bi bi-shield-lock',
      title: 'Secured',
      description: 'Your data is protected with industry-standard encryption and security protocols. We prioritize your privacy and security above all.',
      delay: 0.1
    },
    {
      icon: 'bi bi-patch-check',
      title: 'Verified Users',
      description: 'Join thousands of verified users who trust our platform. Email verification ensures authentic and secure user accounts.',
      delay: 0.2
    },
    {
      icon: 'bi bi-headset',
      title: 'Customer Support',
      description: '24/7 dedicated support team ready to assist you. Get help whenever you need it with our responsive customer service.',
      delay: 0.3
    },
    {
      icon: 'bi bi-envelope-check',
      title: 'Email Verification',
      description: 'Secure your account with email verification. Protect against unauthorized access and ensure account authenticity.',
      delay: 0.4
    }
  ];

  // Enhanced animation variants
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    }
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.1
      }
    }
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.6 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20
      }
    }
  };

  const cardHoverVariants = {
    initial: { y: 0, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' },
    hover: {
      y: -8,
      boxShadow: '0 25px 50px rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 0.5)'
    }
  };

  const floatingVariants = {
    animate: (custom) => ({
      y: [0, -20, 0],
      transition: {
        duration: 4 + custom * 0.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    })
  };

  const statsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const statItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-indigo-50 text-gray-900 relative overflow-x-hidden">
      {/* Premium gradient background - Mesh effect */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated background blobs */}
        <motion.div
          className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-300 via-blue-200 to-transparent rounded-full blur-3xl opacity-20"
          animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        />
        <motion.div
          className="absolute top-1/3 -left-20 w-80 h-80 bg-gradient-to-tr from-indigo-300 to-purple-200 rounded-full blur-3xl opacity-15"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-t from-blue-200 to-transparent rounded-full blur-3xl opacity-15"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        />
        <motion.div
          className="absolute top-1/2 right-0 w-72 h-72 bg-gradient-to-l from-purple-200 to-transparent rounded-full blur-3xl opacity-10"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* Hero Section */}
      <section className="relative z-10 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 py-24 sm:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Content */}
            <motion.div
              className="space-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px 0px -100px 0px' }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 }
                }
              }}
            >
              {/* Badge - Glassmorphic */}
              <motion.div variants={badgeVariants}>
                <motion.span
                  className="inline-flex rounded-full bg-white/60 backdrop-blur-md px-4 py-2 text-sm font-semibold text-blue-600 border border-white/40 shadow-lg shadow-blue-200/20"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <i className="bi bi-stars mr-2"></i>
                  Trusted by leading teams
                </motion.span>
              </motion.div>
              
              {/* Heading + Description */}
              <div className="max-w-xl space-y-6">
                <motion.h1
                  className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 leading-tight"
                  variants={headingVariants}
                >
                  Secure file sharing,{' '}
                  <motion.span
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    style={{
                      backgroundSize: '200% 200%'
                    }}
                  >
                    reimagined
                  </motion.span>
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-700 leading-relaxed"
                  variants={descriptionVariants}
                >
                  Enterprise-grade security meets elegant simplicity. Upload, share, and manage your files with bank-level encryption and instant verification.
                </motion.p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col gap-4 sm:flex-row sm:items-center pt-4"
                variants={descriptionVariants}
              >
                <Link to="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="primary"
                    className="w-full sm:w-auto px-8 py-4 text-lg"
                  >
                    Get Started Free
                    <i className="bi bi-arrow-right ml-2"></i>
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto px-8 py-4 text-lg border-2"
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>

              {/* User Trust Indicator */}
              <motion.div
                className="flex items-center gap-8 pt-8"
                variants={descriptionVariants}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 border-2 border-white flex items-center justify-center text-white text-sm font-semibold cursor-pointer shadow-lg"
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      {i}
                    </motion.div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">10K+</span> users trust us
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Dashboard Preview - Premium Glassmorphic Card */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.85, rotateX: 20 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: '0px 0px -100px 0px' }}
              transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100, damping: 15 }}
              style={{ perspective: '1200px' }}
            >
              {/* Glow backdrop */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{ willChange: 'transform, opacity' }}
              />

              {/* Main card with glassmorphism */}
              <motion.div
                className="relative rounded-2xl border border-white/30 bg-white/70 backdrop-blur-2xl p-1 shadow-2xl overflow-hidden"
                whileHover={{ boxShadow: '0 40px 100px rgba(59, 130, 246, 0.3)' }}
                transition={{ duration: 0.3 }}
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 via-white/40 to-white/20 pointer-events-none" />

                <motion.div
                  className="relative rounded-xl bg-gradient-to-br from-white/95 to-blue-50/50 p-8 shadow-lg"
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Dashboard</p>
                      <h3 className="text-2xl font-bold text-gray-900">Secure Vault</h3>
                    </div>
                    <motion.div
                      className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 shadow-lg shadow-blue-200/40"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <i className="bi bi-lock-fill text-2xl"></i>
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="rounded-xl bg-gradient-to-br from-white/60 to-blue-50/40 backdrop-blur-sm p-4 border border-white/40 cursor-pointer hover:border-blue-200/60"
                        whileHover={{
                          borderColor: 'rgba(59, 130, 246, 0.6)',
                          boxShadow: '0 8px 25px rgba(59, 130, 246, 0.15)'
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Document_{i}.pdf</p>
                            <p className="text-xs text-gray-500 mt-1">2.4 MB • Uploaded today</p>
                          </div>
                          <motion.span
                            className="text-xs font-semibold text-green-600 bg-green-100/60 backdrop-blur-sm px-3 py-1 rounded-full"
                            whileHover={{ scale: 1.05 }}
                          >
                            Verified
                          </motion.span>
                        </div>
                        <div className="w-full h-2 bg-gray-200/40 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                            initial={{ width: 0 }}
                            whileInView={{ width: '80%' }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + i * 0.2, duration: 1 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="mt-8 p-4 rounded-xl bg-gradient-to-r from-blue-100/40 to-indigo-100/40 backdrop-blur-sm border border-blue-200/40 shadow-lg shadow-blue-200/20"
                    whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(59, 130, 246, 0.2)' }}
                  >
                    <div className="flex items-start gap-3">
                      <motion.div
                        className="text-blue-600 text-lg flex-shrink-0 mt-1"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <i className="bi bi-shield-check"></i>
                      </motion.div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Enterprise-grade security</p>
                        <p className="text-xs text-gray-600 mt-1">Military-grade encryption for all uploads</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Floating decoration blobs */}
              <motion.div
                className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full opacity-30 blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{ willChange: 'transform, opacity' }}
              />
              <motion.div
                className="absolute -top-8 -left-8 w-20 h-20 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full opacity-20 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{ willChange: 'transform, opacity' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Divider with gradient */}
      <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 bg-gradient-to-b from-white/60 via-blue-50/40 to-indigo-50/40">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -50px 0px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why teams choose Authify
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Built for security, designed for simplicity. Everything you need to protect and share files with confidence.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          >
            {features.map((feature, index) => {
              const iconColors = [
                'from-blue-600 to-blue-700',
                'from-indigo-600 to-indigo-700',
                'from-cyan-600 to-cyan-700',
                'from-amber-600 to-amber-700'
              ];
              const iconColor = iconColors[index % iconColors.length];
              
              return (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ delay: feature.delay }}
                className="group"
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="relative h-full rounded-2xl border border-gray-200/70 bg-white shadow-md hover:shadow-xl p-6 overflow-hidden transition-all duration-300"
                  whileHover={{
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ willChange: 'transform, box-shadow' }}
                >
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon badge */}
                    <motion.div
                      className={`w-12 h-12 bg-gradient-to-br ${iconColor} rounded-xl flex items-center justify-center mb-4 text-white shadow-md`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <i className={`${feature.icon} text-lg`}></i>
                    </motion.div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
            })}
          </motion.div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent"
            animate={{
              x: [0, 100, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white"
            variants={statsVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -50px 0px' }}
          >
            {[
              { label: '10K+', description: 'Active users' },
              { label: '500M+', description: 'Files secured' },
              { label: '99.9%', description: 'Uptime SLA' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={statItemVariants}
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="cursor-pointer"
              >
                <motion.p
                  className="text-4xl font-bold mb-2 drop-shadow-lg"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  {stat.label}
                </motion.p>
                <p className="text-blue-100">{stat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Decorative shapes */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full opacity-5 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-60 h-60 bg-white rounded-full opacity-5 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </section>

      {/* Section Divider */}
      <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-b from-white/60 to-blue-50/40">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            className="relative bg-gradient-to-br from-white/70 via-blue-50/50 to-indigo-50/50 backdrop-blur-xl rounded-2xl p-12 border border-white/40 text-center shadow-2xl shadow-blue-200/20 overflow-hidden"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -50px 0px' }}
            transition={{ duration: 0.6 }}
            whileHover={{ boxShadow: '0 40px 80px rgba(59, 130, 246, 0.25)' }}
          >
            {/* Gradient border top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-100" />

            {/* Animated background elements */}
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-200 to-transparent rounded-full opacity-30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ pointerEvents: 'none' }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-indigo-200 to-transparent rounded-full opacity-20"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ pointerEvents: 'none' }}
            />

            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Ready to secure your files?
              </h3>
              <p className="text-lg text-gray-700 mb-8">
                Join thousands of teams protecting their documents with bank-grade encryption.
              </p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Link to="/register" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto px-8"
                  >
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto px-8 border-2"
                  >
                    Already have an account?
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 py-16 px-4 border-t border-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <i className="bi bi-shield-check text-white text-lg"></i>
                </div>
                <span className="text-2xl font-bold text-white">Authify</span>
              </div>
              <p className="text-gray-400 text-sm">
                Secure file sharing for modern teams.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><motion.a href="/" className="text-gray-400 hover:text-white transition" whileHover={{ x: 4 }}>Features</motion.a></li>
                <li><motion.a href="/login" className="text-gray-400 hover:text-white transition" whileHover={{ x: 4 }}>Sign In</motion.a></li>
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition" whileHover={{ x: 4 }}>Pricing</motion.a></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition" whileHover={{ x: 4 }}>About</motion.a></li>
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition" whileHover={{ x: 4 }}>Blog</motion.a></li>
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition" whileHover={{ x: 4 }}>Contact</motion.a></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition" whileHover={{ x: 4 }}>Privacy</motion.a></li>
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition" whileHover={{ x: 4 }}>Terms</motion.a></li>
                <li><motion.a href="#" className="text-gray-400 hover:text-white transition" whileHover={{ x: 4 }}>Security</motion.a></li>
              </ul>
            </motion.div>
          </div>
          <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">&copy; 2025 Authify. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <motion.a href="#" className="text-gray-400 hover:text-white transition" whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.95 }}>
                <i className="bi bi-twitter"></i>
              </motion.a>
              <motion.a href="#" className="text-gray-400 hover:text-white transition" whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.95 }}>
                <i className="bi bi-github"></i>
              </motion.a>
              <motion.a href="#" className="text-gray-400 hover:text-white transition" whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.95 }}>
                <i className="bi bi-linkedin"></i>
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;