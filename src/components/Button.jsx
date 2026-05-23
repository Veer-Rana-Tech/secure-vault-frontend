import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200';

  const variants = {
    // Primary gradient button (Upload, main actions)
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-blue-500/40 focus:ring-blue-300 shadow-lg',

    // Secondary outlined button (Cancel, neutral actions)
    secondary: 'bg-white text-gray-900 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md focus:ring-blue-300 shadow-sm',

    // Danger gradient button (Delete destructive - secondary option)
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-xl hover:shadow-red-500/40 focus:ring-red-300 shadow-lg',

    // Ghost/outlined (minimal)
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100/50 focus:ring-gray-300',

    // Solid blue button (Download, view actions)
    blue: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 shadow-md',

    // Solid red button (Delete - primary destructive)
    delete: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300 shadow-md',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-bold',
  };

  const classes = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  const hoverVariants = {
    hover: {
      y: -2,
      scale: 1.05,
      boxShadow: variant === 'primary' || variant === 'danger' || variant === 'blue' || variant === 'delete'
        ? '0 25px 35px rgba(0, 0, 0, 0.25)'
        : '0 15px 25px rgba(0, 0, 0, 0.1)',
    }
  };

  const tapVariants = {
    tap: { scale: 0.95, y: 0 }
  };

  return (
    <motion.button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled ? hoverVariants.hover : {}}
      whileTap={!disabled ? tapVariants.tap : {}}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
        mass: 0.5
      }}
      style={{ willChange: 'transform, box-shadow' }}
      {...props}
    >
      {loading && (
        <motion.div
          className="mr-2 inline-flex h-4 w-4 rounded-full border-2 border-current border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <motion.span
        initial={false}
        animate={loading ? { opacity: 0.6 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

export default Button;
