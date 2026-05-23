import api from './api';

export const fileService = {
  // Upload a file
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get all user files
  getUserFiles: async () => {
    return api.get('/files');
  },

  // Download a file
  downloadFile: async (fileId) => {
    return api.get(`/files/${fileId}`, {
      responseType: 'blob',
    });
  },

  // Delete a file
  deleteFile: async (fileId) => {
    return api.delete(`/files/${fileId}`);
  },
};
