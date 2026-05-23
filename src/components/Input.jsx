import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = showPasswordToggle && showPassword ? 'text' : type;

  const baseClasses = 'w-full rounded-xl border-2 px-4 py-3 bg-white text-gray-900 placeholder-gray-500 shadow-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200';
  const borderClasses = error
    ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200 hover:border-red-400'
    : isFocused
    ? 'border-blue-600 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 shadow-lg shadow-blue-300/30'
    : 'border-gray-300 hover:border-gray-400';

  const classes = `${baseClasses} ${borderClasses} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <motion.label
          className="block text-sm font-semibold text-gray-900"
          animate={isFocused ? { scale: 1.05, color: '#111827' } : { scale: 1, color: '#1f2937' }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </motion.label>
      )}

      <motion.div
        className="relative"
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Animated glow background for focus */}
        {isFocused && (
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-10 blur-sm pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={classes}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ willChange: 'border-color, box-shadow' }}
          {...props}
        />

        {showPasswordToggle && (
          <motion.button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </motion.button>
        )}
      </motion.div>

      {error && (
        <motion.p
          className="text-sm text-red-600 font-medium"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
