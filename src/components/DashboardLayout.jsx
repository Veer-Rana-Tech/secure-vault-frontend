import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      {/* Premium Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 -z-50" />
      
      {/* Animated Blur Blobs */}
      <motion.div
        className="fixed top-20 -left-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-40 pointer-events-none"
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="fixed top-1/3 -right-32 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl -z-40 pointer-events-none"
        animate={{
          y: [0, -30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-40 pointer-events-none"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col min-h-screen">
        {/* Fixed Header */}
        <DashboardHeader onMenuClick={handleMenuClick} />

        {/* Layout Container */}
        <div className="flex flex-1 overflow-hidden pt-20">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

          {/* Main Content Area */}
          <motion.main
            className="flex-1 overflow-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="min-h-full">
              {children}
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
