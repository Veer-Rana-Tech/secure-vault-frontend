import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fileService } from '../services/fileService';
import { motion } from 'framer-motion';
import Card from './Card';
import Button from './Button';

const FileList = ({ refreshTrigger }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fileService.getUserFiles();
      setFiles(response.data || []);
    } catch {
      toast.error('Failed to fetch files');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return { icon: 'bi-file-pdf', gradient: 'from-red-500 to-red-600' };
    if (fileType.includes('image')) return { icon: 'bi-image', gradient: 'from-green-500 to-green-600' };
    if (fileType.includes('word') || fileType.includes('document')) return { icon: 'bi-file-word', gradient: 'from-blue-500 to-blue-600' };
    if (fileType.includes('sheet') || fileType.includes('excel')) return { icon: 'bi-file-spreadsheet', gradient: 'from-emerald-500 to-emerald-600' };
    return { icon: 'bi-file-earmark', gradient: 'from-gray-500 to-gray-600' };
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await fileService.downloadFile(fileId);

      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('File downloaded successfully!');
    } catch {
      toast.error('Failed to download file');
    }
  };

  const handleDelete = async (fileId, fileName) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      setDeleting(fileId);
      try {
        await fileService.deleteFile(fileId);
        toast.success('File deleted successfully!');
        fetchFiles();
      } catch {
        toast.error('Failed to delete file');
      } finally {
        setDeleting(null);
      }
    }
  };

  const getFileStatus = (fileType) => {
    // Determine security status based on file type
    const secureTypes = ['pdf', 'word', 'document'];
    const verifiedTypes = ['pdf', 'image', 'excel'];
    
    if (secureTypes.some(type => fileType.toLowerCase().includes(type))) {
      return { badge: 'Secured', color: 'from-purple-500 to-indigo-500', bgColor: 'bg-purple-100/60' };
    }
    if (verifiedTypes.some(type => fileType.toLowerCase().includes(type))) {
      return { badge: 'Verified', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-100/60' };
    }
    return { badge: 'Verified', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-100/60' };
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <motion.div
            className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span className="ml-3 text-gray-600">Loading files...</span>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glassmorphic Container */}
      <div className="relative">
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl blur-3xl -z-10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          {files.length === 0 ? (
            // Empty State
            <div className="p-12">
              <div className="text-center py-8">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <i className="bi bi-file-earmark text-5xl text-blue-600"></i>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No files yet</h3>
                <p className="text-gray-600">Your uploaded files will appear here</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                      {files.length} File{files.length !== 1 ? 's' : ''}
                      <span className="ml-2 text-xs font-medium text-gray-600">
                        • {formatFileSize(files.reduce((sum, f) => sum + f.fileSize, 0))}
                      </span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-8 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="w-24 text-center">Status</div>
                    <div className="w-20 text-right">Actions</div>
                  </div>
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-200">
                {files.map((file, index) => {
                  const fileInfo = getFileIcon(file.fileType);
                  const status = getFileStatus(file.fileType);

                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="group"
                    >
                      <div className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                        <div className="flex items-center justify-between gap-4">
                          {/* File Info Column */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* File Icon */}
                            <motion.div
                              className={`w-12 h-12 bg-gradient-to-br ${fileInfo.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow duration-200`}
                              whileHover={{ scale: 1.08, rotate: 5 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            >
                              <i className={`bi ${fileInfo.icon} text-white text-lg`}></i>
                            </motion.div>

                            {/* File Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200" title={file.fileName}>
                                {file.fileName}
                              </h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                                  {formatFileSize(file.fileSize)}
                                </span>
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                <span className="text-xs text-gray-600">
                                  {formatDate(file.uploadedAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status Badge Column */}
                          <div className="flex-shrink-0 w-32">
                            <motion.div
                              className={`inline-flex items-center gap-2 px-3 py-1.5 ${status.bgColor} rounded-full border border-gray-200 backdrop-blur-sm`}
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            >
                              <motion.span
                                className={`w-2 h-2 rounded-full bg-gradient-to-r ${status.color}`}
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <span className={`text-xs font-bold bg-gradient-to-r ${status.color} bg-clip-text text-transparent`}>
                                {status.badge}
                              </span>
                            </motion.div>
                          </div>

                          {/* Action Buttons Column */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Download Button */}
                            <motion.button
                              className="relative px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 group/btn font-medium text-sm"
                              onClick={() => handleDownload(file.id, file.fileName)}
                              title="Download file"
                              disabled={deleting === file.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <i className="bi bi-download mr-1"></i>
                              Download
                            </motion.button>

                            {/* Delete Button */}
                            <motion.button
                              className="relative px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 group/btn font-medium text-sm"
                              onClick={() => handleDelete(file.id, file.fileName)}
                              disabled={deleting === file.id}
                              title="Delete file"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {deleting === file.id ? (
                                <motion.div
                                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full inline-block"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                />
                              ) : (
                                <><i className="bi bi-trash mr-1"></i>Delete</>
                              )}
                            </motion.button>

                            {/* Delete Button */}
                            <motion.button
                              className="relative px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 group/btn font-medium text-sm"
                              onClick={() => handleDelete(file.id, file.fileName)}
                              disabled={deleting === file.id}
                              title="Delete file"
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {deleting === file.id ? (
                                <motion.div
                                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full inline-block"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                />
                              ) : (
                                <><i className="bi bi-trash mr-1"></i>Delete</>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FileList;
