import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './Button';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <motion.nav
      className="bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-lg shadow-blue-200/10"
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Mobile menu button */}
          <motion.button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="bi bi-list text-xl"></i>
          </motion.button>

          {/* Logo/Brand */}
          <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
            <motion.div
              className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
              whileHover={{ rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <i className="bi bi-shield-check text-white text-sm"></i>
            </motion.div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
              Authify
            </span>
          </motion.div>

          {/* Spacer */}
          <div className="flex-1 hidden md:block" />

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg text-gray-600 hover:bg-gradient-to-br hover:from-blue-100/50 hover:to-indigo-100/50 transition-colors"
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <i className="bi bi-moon-stars text-lg"></i>
              ) : (
                <i className="bi bi-sun text-lg"></i>
              )}
            </motion.button>

            {/* Notifications */}
            <motion.button
              className="p-2.5 rounded-lg text-gray-600 hover:bg-gradient-to-br hover:from-blue-100/50 hover:to-indigo-100/50 transition-colors relative"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              title="Notifications"
            >
              <i className="bi bi-bell text-lg"></i>
              <motion.span
                className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200/50 hidden sm:block" />

            {/* User Avatar & Info */}
            <motion.div 
              className="flex items-center gap-3 group cursor-pointer px-2 py-1.5 rounded-lg hover:bg-white/40 transition-colors"
              whileHover={{ x: 2 }}
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name || 'User'}
                </p>
                <motion.p
                  className="text-xs font-medium text-green-600 flex items-center gap-1"
                  animate={{ opacity: [0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  {user?.isAccountVerified ? 'Verified' : 'Pending'}
                </motion.p>
              </div>
              <motion.div 
                className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md text-white font-semibold text-sm"
                whileHover={{ scale: 1.05 }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </motion.div>
            </motion.div>

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="danger"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex"
              >
                <i className="bi bi-box-arrow-right mr-2"></i>
                Logout
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;