import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = true,
  gradient = false,
  icon = null,
  iconGradient = 'from-blue-500 to-indigo-600',
  title = null,
  description = null,
  ...props
}) => {
  const baseClasses = gradient
    ? 'bg-gradient-to-br from-white/85 via-blue-50/50 to-indigo-50/40 rounded-2xl border border-gray-200/60 shadow-md hover:shadow-xl backdrop-blur-sm'
    : 'bg-white rounded-2xl border border-gray-200/70 shadow-md hover:shadow-xl';

  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      whileHover={hover ? {
        y: -4,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
      } : {}}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        duration: 0.4
      }}
      style={{ willChange: hover ? 'transform, box-shadow' : 'auto' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;