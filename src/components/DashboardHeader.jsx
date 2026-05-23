import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Button from './Button';

const DashboardHeader = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications - replace with API call later
  const [notifications] = useState([
    { id: 1, message: 'File uploaded successfully', time: '2 minutes ago', icon: 'bi-cloud-check', color: 'text-green-600' },
    { id: 2, message: 'Profile updated', time: '1 hour ago', icon: 'bi-person-check', color: 'text-blue-600' },
    { id: 3, message: 'File deleted', time: '3 hours ago', icon: 'bi-trash', color: 'text-red-600' },
  ]);

  const handleLogout = () => {
    logout(navigate);
  };

  // Navigation tabs for dashboard
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', path: '/dashboard' },
    { id: 'upload', label: 'Upload Files', icon: 'bi-cloud-arrow-up', path: '/dashboard?section=upload' },
    { id: 'files', label: 'My Files', icon: 'bi-files', path: '/dashboard?section=files' },
    { id: 'notes', label: 'Notes', icon: 'bi-journal', path: '/notes' },
    { id: 'profile', label: 'Profile', icon: 'bi-person-circle', path: '/profile' },
    { id: 'settings', label: 'Settings', icon: 'bi-gear', path: '/profile/settings' },
  ];

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (location.pathname === '/dashboard') {
      const params = new URLSearchParams(location.search);
      const section = params.get('section');
      return section || 'dashboard';
    }
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname === '/profile/settings') return 'settings';
    if (location.pathname === '/notes') return 'notes';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button - Left Side */}
          <motion.button
            onClick={onMenuClick}
            className="lg:hidden p-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors mr-2"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            title="Open sidebar menu"
          >
            <i className="bi bi-list text-xl"></i>
          </motion.button>

          {/* Left: Logo & Brand */}
          <motion.div
            className="flex items-center gap-3 flex-shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
              whileHover={{ rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <i className="bi bi-shield-check text-white text-lg"></i>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
              Authify
            </span>
          </motion.div>

          {/* Center: Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-8">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.path)}
                  className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className={`bi ${tab.icon}`}></i>
                  {tab.label}

                  {/* Active tab underline */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-lg"
                      layoutId="activeTabIndicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right: Actions & User */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                title="Notifications"
              >
                <i className="bi bi-bell text-lg"></i>

                {/* Notification Badge - Only show if notifications exist */}
                {notifications.length > 0 && (
                  <motion.span
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {notifications.length}
                  </motion.span>
                )}
              </motion.button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <p className="text-sm font-bold text-gray-900">Notifications</p>
                  </div>

                  {/* Notifications List */}
                  {notifications.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 text-lg flex-shrink-0 ${notification.color}`}>
                              <i className={`bi ${notification.icon}`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <i className="bi bi-inbox text-3xl text-gray-300 block mb-2"></i>
                      <p className="text-sm text-gray-500">No notifications</p>
                    </div>
                  )}

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                      <motion.button
                        className="w-full text-sm text-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View all notifications
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Backdrop to close dropdown */}
              {showNotifications && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
              )}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

            {/* User Avatar with Dropdown Intent */}
            <motion.div
              className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name ? user.name.split(' ')[0] : 'User'}
                </p>
                <motion.p
                  className="text-xs text-gray-500 flex items-center gap-1"
                  animate={{ opacity: [0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  {user?.isAccountVerified ? 'Verified' : 'Pending'}
                </motion.p>
              </div>

              {/* User Avatar Circle */}
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md text-white font-bold text-base"
                whileHover={{ scale: 1.08 }}
              >
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : 'U'}
              </motion.div>

              {/* Dropdown Indicator */}
              <motion.i
                className="bi bi-chevron-down text-gray-400 hidden sm:block text-sm group-hover:text-gray-600"
                animate={{ rotate: 0 }}
              />
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
                className="hidden sm:inline-flex items-center gap-2 px-4"
              >
                <i className="bi bi-box-arrow-right"></i>
                <span className="hidden md:inline">Logout</span>
              </Button>
            </motion.div>

            {/* Mobile Logout Button */}
            <motion.button
              onClick={handleLogout}
              className="sm:hidden p-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              title="Logout"
            >
              <i className="bi bi-box-arrow-right text-lg"></i>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Tabs - Horizontal Scroll */}
        <motion.div
          className="flex lg:hidden -mx-4 px-4 pb-3 gap-2 overflow-x-auto scrollbar-hide"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => handleNavClick(tab.path)}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm flex items-center gap-1.5 whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className={`bi ${tab.icon}`}></i>
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
