import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import UserData from './pages/UserData';
import ChangePassword from './pages/ChangePassword';
import ProfileView from './pages/profile/ProfileView';
import EditProfile from './pages/profile/EditProfile';
import ProfileSettings from './pages/profile/ProfileSettings';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  console.log("APP TOKEN:", localStorage.getItem("token"));

  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* Animated Background Blobs */}
        <motion.div
          className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-blue-600/20 rounded-full blur-3xl -z-10"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="fixed top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-purple-500/25 to-indigo-600/20 rounded-full blur-3xl -z-10"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="fixed bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-500/15 rounded-full blur-3xl -z-10"
          animate={{
            x: [0, 80, 0],
            y: [0, 80, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/notes" element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            } />
            <Route path="/user-data" element={
              <ProtectedRoute>
                <UserData />
              </ProtectedRoute>
            } />
            <Route path="/email-verify" element={<EmailVerify />} />
            <Route path="/change-password" element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <ProfileView />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/profile/edit" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <EditProfile />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/profile/settings" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <ProfileSettings />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  );
};

export default App;
