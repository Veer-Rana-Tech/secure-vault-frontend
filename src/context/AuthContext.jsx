import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  console.log("CTX TOKEN STATE:", token);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const register = async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password);
      toast.success('Registration successful! Please check your email to verify your account.');
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const login = async (email, password, navigateCallback) => {
    try {
      const response = await authService.login(email, password);

      if (response.token) {
        localStorage.setItem("token", response.token);
        setToken(response.token);

        try {
          const profile = await authService.getProfile();
          const userData = {
            email: profile.email,
            name: profile.name,
            userId: profile.userId,
            isAccountVerified: profile.isAccountVerified
          };
          setUser(userData);
          toast.success('Login successful!');

          setTimeout(() => {
            if (navigateCallback) {
              navigateCallback('/dashboard');
            }
          }, 50);

          return { success: true, data: response, user: userData };
        } catch (profileError) {
          console.warn('Profile fetch failed, using basic user data:', profileError);
          const userData = {
            email: response.email,
            isAccountVerified: false
          };
          setUser(userData);
          toast.success('Login successful!');

          setTimeout(() => {
            if (navigateCallback) {
              navigateCallback('/email-verify');
            }
          }, 50);

          return { success: true, data: response, user: userData };
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = (navigateCallback) => {
    console.log("LOGOUT CALLED");
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('Logged out successfully');

    if (navigateCallback) {
      navigateCallback('/');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const isAuthenticated = !!token;

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    updateUser,
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
