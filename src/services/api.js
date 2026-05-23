import axios from 'axios';
import { AppConstants } from '../util/constants';

const api = axios.create({
  baseURL: AppConstants.BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // DO NOT automatically logout on 401 errors
      // This prevents logout during login flow when getProfile() might return 401
      // Just reject the error and let components handle it
      console.warn('401 Unauthorized response received');
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;