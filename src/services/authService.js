import api from './api';

export const authService = {
  register: async (name, email, password) => {
    const response = await api.post('/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/login', {
      email,
      password,
    });
    return response.data;
  },

  sendResetOtp: async (email) => {
    const response = await api.post('/send-reset-otp', null, {
      params: { email }
    });
    return response.data;
  },

  resetPassword: async (email, otp, newPassword) => {
    const response = await api.post('/reset-password', {
      email,
      otp,
      newPassword,
    });
    return response.data;
  },

  sendVerifyOtp: async (email) => {
    const response = await api.post('/send-otp', { email });
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await api.post('/verify-otp', { email, otp });
    return response.data;
  },

  verifyEmail: async (email, otp) => {
    const response = await api.post('/verify-email', { email, otp });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  getNotes: async () => {
    const response = await api.get('/notes');
    return response.data;
  },

  createNote: async (note) => {
    const response = await api.post('/notes', note);
    return response.data;
  },

  updateNote: async (id, note) => {
    const response = await api.put(`/notes/${id}`, note);
    return response.data;
  },

  deleteNote: async (id) => {
    await api.delete(`/notes/${id}`);
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};