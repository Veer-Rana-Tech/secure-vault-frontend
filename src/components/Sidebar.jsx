import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      icon: 'bi-speedometer2',
      label: 'Dashboard',
      path: '/dashboard',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'bi-journal',
      label: 'Notes',
      path: '/notes',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: 'bi-cloud-arrow-up',
      label: 'Upload Files',
      path: '/dashboard?section=upload',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: 'bi-files',
      label: 'My Files',
      path: '/dashboard?section=files',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'bi-gear',
      label: 'Settings',
      path: '/profile/settings',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const isActive = (path) => {
    if (path === '/dashboard?section=upload') {
      return location.pathname === '/dashboard' && new URLSearchParams(location.search).get('section') === 'upload';
    }
    if (path === '/dashboard?section=files') {
      return location.pathname === '/dashboard' && new URLSearchParams(location.search).get('section') === 'files';
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-white/70 backdrop-blur-xl border-r border-gray-200/60 shadow-lg shadow-blue-100/20 z-40 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:top-0 lg:h-screen`}
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section - Desktop Only */}
          <div className="hidden lg:flex items-center gap-3 p-6 border-b border-gray-200/40">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <i className="bi bi-shield-check text-white text-lg"></i>
            </motion.div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Authify</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => {
              const active = isActive(item.path);
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={item.path}
                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 overflow-hidden ${
                      active
                        ? 'text-white shadow-lg'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                    onClick={onClose}
                  >
                    {/* Background gradient for active state */}
                    {active && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${item.color}`}
                        layoutId="sidebarActiveIndicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ zIndex: -1 }}
                      />
                    )}

                    {/* Hover background for inactive state */}
                    {!active && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ zIndex: -1 }}
                      />
                    )}

                    {/* Icon */}
                    <motion.div
                      className={`flex-shrink-0 text-lg ${
                        active ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'
                      }`}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <i className={`bi ${item.icon}`}></i>
                    </motion.div>

                    {/* Label */}
                    <span className={`font-medium text-sm flex-1 ${
                      active ? 'text-white' : ''
                    }`}>
                      {item.label}
                    </span>

                    {/* Indicator dot for active */}
                    {active && (
                      <motion.div
                        className="w-1.5 h-1.5 bg-white rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* User Info */}
          <div className="p-4">
            <motion.div
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-white/60 to-blue-50/40 border border-blue-100/40 backdrop-blur-sm hover:border-blue-200/60 transition-all duration-200 cursor-pointer group"
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md text-white font-bold text-sm flex-shrink-0"
                whileHover={{ scale: 1.1 }}
              >
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : 'U'}
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.isAccountVerified ? '✓ Verified' : '⚠ Pending'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;