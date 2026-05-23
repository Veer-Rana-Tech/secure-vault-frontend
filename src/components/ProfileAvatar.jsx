import { useAuth } from '../context/AuthContext';

const ProfileAvatar = () => {
  const { user } = useAuth();

  const getInitials = () => {
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0].substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium text-gray-800">{user?.name || user?.email}</span>
        <div className="flex items-center gap-1">
          {user?.isAccountVerified ? (
            <>
              <span className="text-xs text-green-600 font-medium">Verified</span>
              <i className="bi bi-check-circle-fill text-green-600 text-xs"></i>
            </>
          ) : (
            <>
              <span className="text-xs text-red-600 font-medium">Not Verified</span>
              <i className="bi bi-x-circle-fill text-red-600 text-xs"></i>
            </>
          )}
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
        {getInitials()}
      </div>
    </div>
  );
};

export default ProfileAvatar;