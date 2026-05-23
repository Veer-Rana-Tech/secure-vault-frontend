import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, illustration }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  const illustrationVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.6,
        delay: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden flex justify-center">
      <motion.div
        className="w-full max-w-7xl flex min-h-screen flex-col lg:flex-row"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left: Form */}
        <motion.div
          className="lg:w-1/2 flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16"
          variants={itemVariants}
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {children}
          </motion.div>
        </motion.div>

        {/* Right: Illustration */}
        <motion.div
          className="lg:w-1/2 hidden lg:flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-10 relative overflow-hidden"
          variants={illustrationVariants}
        >
          {/* Animated background shapes */}
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />

          {/* Floating shapes */}
          <motion.div
            className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-200 to-transparent rounded-full blur-3xl opacity-20"
            animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-indigo-200 to-transparent rounded-full blur-3xl opacity-20"
            animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="w-full max-w-md h-full relative z-10">
            {illustration}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
