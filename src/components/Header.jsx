import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileAvatar from './ProfileAvatar';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  if (!isAuthenticated) return null;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="bi bi-shield-check text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Authify
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <i className="bi bi-house"></i>
              <span className="font-medium">Dashboard</span>
            </Link>
            {!user?.isAccountVerified && (
              <Link to="/email-verify" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <i className="bi bi-check-circle"></i>
                <span className="font-medium">Verify Email</span>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <i className="bi bi-cloud-upload text-sm"></i>
                <span className="font-medium text-sm">Upload Files</span>
              </button>
              <Link to="/user-data" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <i className="bi bi-database text-sm"></i>
                <span className="font-medium text-sm">Your Data</span>
              </Link>
              <Link to="/profile/edit" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <i className="bi bi-person-gear text-sm"></i>
                <span className="font-medium text-sm">Update Profile</span>
              </Link>
              <Link to="/profile/settings" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <i className="bi bi-gear text-sm"></i>
                <span className="font-medium text-sm">Settings</span>
              </Link>
            </div>
             <ProfileAvatar />
             <button
               onClick={handleLogout}
               className="hidden md:block px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 hover:scale-105 transition-all"
             >
               <i className="bi bi-box-arrow-right me-2"></i>
               Logout
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;