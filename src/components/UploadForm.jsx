import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fileService } from '../services/fileService';
import { motion } from 'framer-motion';
import Card from './Card';
import Button from './Button';

const UploadForm = ({ onFileUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSelectedFileName(selectedFile.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setSelectedFileName(droppedFile.name);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.warning('Please select a file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('File type not allowed. Allowed types: PDF, Images, Word, Excel');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setShowSuccessAnimation(false);

    try {
      // Simulate progress for realistic upload experience
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 30;
        });
      }, 200);

      await fileService.uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Add file to uploaded list with animation
      const newUploadedFile = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
        type: file.type,
      };

      setUploadedFiles((prev) => [newUploadedFile, ...prev]);
      
      // Show success animation
      setShowSuccessAnimation(true);
      setUploadSuccess(true);

      toast.success(`File "${file.name}" uploaded successfully!`);
      
      // Reset after animation
      setTimeout(() => {
        setFile(null);
        setSelectedFileName('');
        setUploadProgress(0);
        setShowSuccessAnimation(false);
        setUploadSuccess(false);
        document.getElementById('fileInput').value = '';
        onFileUploaded();
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload file';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Main Upload Card */}
      <Card className="p-8 relative overflow-hidden bg-white border border-gray-200">
        {/* Background glow effect */}
        {dragOver && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-transparent rounded-2xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50"
              whileHover={{ scale: 1.1, rotate: 5 }}
              animate={dragOver ? { scale: 1.15 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.i
                className="bi bi-cloud-arrow-up text-white text-3xl"
                animate={dragOver ? { y: -8 } : { y: [0, -5, 0] }}
                transition={{ duration: dragOver ? 0.4 : 2, repeat: !dragOver ? Infinity : 0 }}
              ></motion.i>
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Upload Files
            </h2>
            <p className="text-gray-700 font-medium">
              Drag & drop or click to select files
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* Enhanced Drag & Drop Zone */}
            <input
              type="file"
              id="fileInput"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"
            />

            <motion.label
              htmlFor="fileInput"
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer block overflow-hidden ${
                dragOver
                  ? 'border-blue-600 bg-blue-50'
                  : selectedFileName
                  ? 'border-green-500 bg-green-50/50'
                  : 'border-gray-300 hover:border-blue-500 bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              whileHover={!uploading ? { scale: 1.01 } : {}}
              animate={dragOver ? { boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' } : {}}
              transition={{ type: 'spring', stiffness: 300 }}
            >

              <div className="relative z-10">
                {selectedFileName && !uploading && !uploadSuccess ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="space-y-4"
                  >
                    <motion.div
                      className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/50"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      <i className="bi bi-check text-white text-2xl"></i>
                    </motion.div>
                    <div>
                      <p className="text-green-700 font-bold text-lg">{selectedFileName}</p>
                      {file && (
                        <p className="text-sm text-gray-700 mt-1 font-medium">
                          Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </motion.div>
                ) : uploading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <motion.div
                      className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-blue-500/50"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <i className="bi bi-cloud-arrow-up text-white text-2xl"></i>
                    </motion.div>
                    <p className="text-blue-700 font-bold">{selectedFileName}</p>
                    <p className="text-sm text-gray-700 font-medium">Uploading...</p>
                  </motion.div>
                ) : uploadSuccess && showSuccessAnimation ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="space-y-4"
                  >
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/50"
                      animate={{ scale: [0.8, 1.1, 1], rotate: [0, 10, 0] }}
                      transition={{ duration: 0.6 }}
                    >
                      <motion.i
                        className="bi bi-check text-white text-3xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                      ></motion.i>
                    </motion.div>
                    <p className="text-green-700 font-semibold text-lg">Upload Successful!</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <motion.div
                      className="w-14 h-14 bg-gradient-to-br from-blue-400/70 to-indigo-400/70 rounded-full flex items-center justify-center mx-auto"
                      animate={dragOver ? { y: -8, scale: 1.1 } : { y: [0, -8, 0] }}
                      transition={{ duration: dragOver ? 0.3 : 2, repeat: !dragOver ? Infinity : 0 }}
                    >
                      <i className="bi bi-cloud-arrow-up text-white text-2xl"></i>
                    </motion.div>
                    <div>
                      <p className="text-gray-900 font-bold">
                        {dragOver ? 'Drop your files here' : 'Click to browse or drag & drop'}
                      </p>
                      <p className="text-sm text-gray-700 mt-1 font-medium">
                        PDF, Images, Word, Excel • Max 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.label>

            {/* Progress Bar */}
            {uploading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Uploading</span>
                  <span className="text-sm font-bold text-blue-700">
                    {Math.min(Math.round(uploadProgress), 100)}%
                  </span>
                </div>
                <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                  {/* Animated gradient progress bar */}
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-lg shadow-blue-500/50"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                  />
                  
                  {/* Shimmer effect on progress bar */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ['0%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            )}

            {/* Upload Button */}
            <Button
              type="submit"
              disabled={!file || uploading}
              className="w-full relative group"
            >
              <motion.span
                animate={dragOver ? { scale: 1.05 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {uploading ? (
                  <>
                    <i className="bi bi-hourglass-split mr-2 animate-spin"></i>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="bi bi-cloud-arrow-up mr-2"></i>
                    Upload File
                  </>
                )}
              </motion.span>
            </Button>
          </form>
        </div>
      </Card>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="bi bi-check-circle-fill text-green-600"></i>
            Recently Uploaded
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((uploadedFile, index) => (
              <motion.div
                key={uploadedFile.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4, type: 'spring', stiffness: 300 }}
              >
                <Card className="p-5 group hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full">
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-indigo-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 rounded-2xl"
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <motion.div
                        className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <i className="bi bi-file-earmark-check text-white text-lg"></i>
                      </motion.div>
                      <motion.div
                        className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                      >
                        <i className="bi bi-check text-green-600 text-sm font-bold"></i>
                      </motion.div>
                    </div>

                    <h4 className="font-semibold text-gray-900 text-sm truncate mb-2" title={uploadedFile.name}>
                      {uploadedFile.name}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span className="text-green-600 font-medium">✓</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadForm;
