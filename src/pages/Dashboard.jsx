import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import UploadForm from '../components/UploadForm';
import FileList from '../components/FileList';
import NoteList from '../components/NoteList';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import Card from '../components/Card';
import Button from '../components/Button';

const Dashboard = () => {
  const { user: _user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [fileRefreshTrigger, setFileRefreshTrigger] = useState(0);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState([
    {
      title: 'Total Files',
      value: '0',
      description: 'Loading...',
      icon: 'bi-file-earmark',
      color: 'blue'
    },
    {
      title: 'Storage Used',
      value: '0',
      description: 'Calculating...',
      icon: 'bi-hdd',
      color: 'green'
    },
    {
      title: 'Active Sessions',
      value: '0',
      description: 'Checking...',
      icon: 'bi-people',
      color: 'purple'
    },
    {
      title: 'Upload Speed',
      value: '0',
      description: 'Measuring...',
      icon: 'bi-speedometer2',
      color: 'pink'
    }
  ]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Function to format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    } else if (diffInHours > 0) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (diffInMinutes > 0) {
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    } else {
      return 'Just now';
    }
  };

  // Function to calculate profile completeness percentage
  const calculateProfileCompleteness = () => {
    if (!profile) return 0;

    let completedFields = 0;
    let totalFields = 5; // Total possible completion criteria

    // Basic info (name and email are always required, so always complete)
    completedFields += 1; // Basic info section

    // Email verification (worth 20% of completion)
    if (profile.isAccountVerified) {
      completedFields += 1;
    }

    // Has notes (shows engagement, worth 20% of completion)
    if (notes && notes.length > 0) {
      completedFields += 1;
    }

    // Account age (older accounts show more commitment, worth 20% of completion)
    if (profile.createdAt) {
      const accountAge = new Date() - new Date(profile.createdAt);
      const daysOld = accountAge / (1000 * 60 * 60 * 24);
      if (daysOld > 7) { // Account older than 1 week
        completedFields += 1;
      }
    }

    // Profile updates (if they've logged in recently, worth 20% of completion)
    // This is a simple proxy - in a real app you'd track profile update timestamps
    completedFields += 1; // Assume they have basic engagement

    const percentage = Math.round((completedFields / totalFields) * 100);
    return Math.min(percentage, 100); // Cap at 100%
  };

  useEffect(() => {
    const fetchData = async () => {
      let userId = null;

      // Try to fetch profile data
      try {
        const profileData = await authService.getProfile();
        setProfile(profileData);
        userId = profileData.userId;
      } catch (error) {
        console.error('Failed to load profile:', error);
        // Set default profile data
        setProfile({
          name: 'User',
          email: 'user@example.com',
          userId: 'USER001',
          isAccountVerified: false
        });
        userId = 'USER001';
      }

      // Try to fetch notes data from backend, fallback to user-specific localStorage
      try {
        const notesData = await authService.getNotes();
        // Normalize notes to ensure required fields
        const normalizedNotes = notesData.map(note => ({
          ...note,
          pinned: note.pinned || false,
          liked: note.liked || false,
          likeCount: note.likeCount || (note.liked ? 1 : 0),
          description: note.description || note.content || ''
        }));
        setNotes(normalizedNotes);
        // Save to user-specific localStorage as backup
        localStorage.setItem(`localNotes_${userId}`, JSON.stringify(normalizedNotes));
      } catch (error) {
        console.error('Failed to load notes from backend:', error);
        // Load from user-specific localStorage as fallback
        const localNotes = localStorage.getItem(`localNotes_${userId}`);
        if (localNotes) {
          const parsedNotes = JSON.parse(localNotes);
          const normalizedNotes = parsedNotes.map(note => ({
            ...note,
            pinned: note.pinned || false,
            liked: note.liked || false,
            likeCount: note.likeCount || (note.liked ? 1 : 0),
            description: note.description || note.content || ''
          }));
          setNotes(normalizedNotes);
        } else {
          setNotes([]);
        }
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    {
      icon: 'bi bi-person-gear',
      title: 'Update Profile',
      link: '/profile/edit',
      color: 'bg-blue-500',
      description: 'Manage your account details'
    },
    {
      icon: 'bi bi-clock-history',
      title: 'Login History',
      link: '#',
      color: 'bg-green-500',
      description: 'View recent login activity'
    },
    {
      icon: 'bi bi-bell',
      title: 'Notifications',
      link: '#',
      color: 'bg-purple-500',
      description: 'Manage notification settings'
    },
    {
      icon: 'bi bi-key',
      title: 'Change Password',
      link: '/change-password',
      color: 'bg-orange-500',
      description: 'Update your password'
    }
  ];

  const handleNoteEdit = (note) => {
    setEditingNote(note);
    setShowNoteEditor(true);
  };

  const closeNoteEditor = () => {
    setShowNoteEditor(false);
    setEditingNote(null);
  };

  const handleNoteSave = async (noteData) => {
    const { title, description } = noteData;
    const content = description; // Use description as content for backend
    const userId = profile?.userId || 'USER001';
    const localStorageKey = `localNotes_${userId}`;

    try {
      if (editingNote) {
        // Try to update on backend
        await authService.updateNote(editingNote.id, { title, content });
        const updatedNotes = notes.map(n => n.id === editingNote.id ? { ...n, title, content, description: content } : n);
        setNotes(updatedNotes);
        localStorage.setItem(localStorageKey, JSON.stringify(updatedNotes));
        toast.success('Note updated successfully');
      } else {
        // Try to create on backend
        const newNote = await authService.createNote({ title, content });
        const normalizedNewNote = {
          ...newNote,
          pinned: newNote.pinned || false,
          liked: newNote.liked || false,
          likeCount: newNote.likeCount || 0,
          description: content
        };
        const updatedNotes = [normalizedNewNote, ...notes];
        setNotes(updatedNotes);
        localStorage.setItem(localStorageKey, JSON.stringify(updatedNotes));
        toast.success('Note created successfully');
      }
    } catch (error) {
      console.error('Backend save failed, saving locally:', error);
      if (editingNote) {
        const updatedNotes = notes.map(n => n.id === editingNote.id ? { ...n, title, content, description: content, updatedAt: new Date().toISOString() } : n);
        setNotes(updatedNotes);
        localStorage.setItem(localStorageKey, JSON.stringify(updatedNotes));
        toast.success('Note updated locally (backend unavailable)');
      } else {
        const localNote = {
          id: Date.now(),
          title,
          content,
          description: content,
          pinned: false,
          liked: false,
          likeCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const updatedNotes = [localNote, ...notes];
        setNotes(updatedNotes);
        const currentNotes = localStorage.getItem(localStorageKey);
        const parsedNotes = currentNotes ? JSON.parse(currentNotes) : [];
        localStorage.setItem(localStorageKey, JSON.stringify([localNote, ...parsedNotes]));
        toast.success('Note created locally (backend unavailable)');
      }
    }
    closeNoteEditor();
  };

   const handleNoteDelete = async (id) => {
     const userId = profile?.userId || 'USER001';
     const localStorageKey = `localNotes_${userId}`;

     try {
       await authService.deleteNote(id);
       const updatedNotes = notes.filter(n => n.id !== id);
       setNotes(updatedNotes);
       localStorage.setItem(localStorageKey, JSON.stringify(updatedNotes));
       toast.success('Note deleted successfully');
     } catch (error) {
       console.error('Backend delete failed, removing locally:', error);
       const updatedNotes = notes.filter(n => n.id !== id);
       setNotes(updatedNotes);
       localStorage.setItem(localStorageKey, JSON.stringify(updatedNotes));
       toast.success('Note deleted locally (backend unavailable)');
     }
   };

   const handleTogglePin = (id, newPinnedState) => {
     const updatedNotes = notes.map(n =>
       n.id === id ? { ...n, pinned: newPinnedState } : n
     );
     setNotes(updatedNotes);
     const userId = profile?.userId || 'USER001';
     localStorage.setItem(`localNotes_${userId}`, JSON.stringify(updatedNotes));
     toast.success(newPinnedState ? 'Note pinned' : 'Note unpinned');
   };

  const handleToggleLike = (id, newLikedState) => {
    const updatedNotes = notes.map(n =>
      n.id === id
        ? {
            ...n,
            liked: newLikedState,
            likeCount: newLikedState
              ? (n.likeCount || 0) + 1
              : Math.max((n.likeCount || 1) - 1, 0)
          }
        : n
    );
    setNotes(updatedNotes);

    const userId = profile?.userId || 'USER001';
    localStorage.setItem(`localNotes_${userId}`, JSON.stringify(updatedNotes));
  };

  // Helper: Format bytes to human readable
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Fetch dashboard stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await authService.getDashboardStats();
        // Normalize and map stats from backend response
        const backendStats = data?.stats || data;
        const mappedStats = [
          {
            title: 'Total Files',
            value: backendStats.totalFiles?.toString() || '0',
            description: backendStats.filesThisWeek
              ? `+${backendStats.filesThisWeek} this week`
              : 'No new files',
            icon: 'bi-file-earmark',
            color: 'blue'
          },
          {
            title: 'Storage Used',
            value: formatBytes(backendStats.storageUsed || 0),
            description: backendStats.storageLimit
              ? `of ${formatBytes(backendStats.storageLimit)} total`
              : 'Unlimited',
            icon: 'bi-hdd',
            color: 'green'
          },
          {
            title: 'Active Sessions',
            value: backendStats.activeSessions?.toString() || '0',
            description: backendStats.sessionsStatus || 'All secure',
            icon: 'bi-people',
            color: 'purple'
          },
          {
            title: 'Upload Speed',
            value: backendStats.uploadSpeed
              ? `${backendStats.uploadSpeed} Mbps`
              : 'N/A',
            description: backendStats.speedTrend
              ? `↑ ${backendStats.speedTrend} vs last week`
              : 'Speed unavailable',
            icon: 'bi-speedometer2',
            color: 'pink'
          }
        ];
        setStats(mappedStats);
        localStorage.setItem('dashboardStats', JSON.stringify(mappedStats));
      } catch (error) {
        console.error('Failed to load stats from backend:', error);
        // Keep default static values or load from localStorage fallback
        const savedStats = localStorage.getItem('dashboardStats');
        if (savedStats) {
          try {
            setStats(JSON.parse(savedStats));
          } catch {
            // keep default
          }
        }
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const handleFileUploaded = () => {
    // Trigger FileList refresh
    setFileRefreshTrigger(prev => prev + 1);
  };

  // Recent activity data
  const recentActivity = [
    { id: 1, name: 'document.pdf', action: 'uploaded', time: '2 hours ago', icon: 'bi-file-pdf' },
    { id: 2, name: 'image.png', action: 'uploaded', time: '4 hours ago', icon: 'bi-image' },
    { id: 3, name: 'spreadsheet.xlsx', action: 'deleted', time: '1 day ago', icon: 'bi-file-spreadsheet' },
    { id: 4, name: 'presentation.pptx', action: 'uploaded', time: '2 days ago', icon: 'bi-file-presentation' },
  ];

    const renderMainContent = () => {
    switch (activeSection) {
      case 'upload':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <UploadForm onFileUploaded={handleFileUploaded} />
          </motion.div>
        );
      case 'files':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FileList refreshTrigger={fileRefreshTrigger} />
          </motion.div>
        );
      default:
        return (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative mb-6"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400/15 via-indigo-400/15 to-purple-400/10 rounded-3xl blur-3xl -z-10"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <div className="relative bg-gradient-to-br from-white/80 via-blue-50/60 to-indigo-50/40 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl shadow-blue-200/30 p-8 overflow-hidden group hover:shadow-3xl hover:border-blue-200/60 transition-all duration-300">
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h1 className="text-5xl font-black mb-2 text-gray-900">
                      Welcome back, <span className="relative inline-block">
                        <motion.span
                          className="gradient-text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {profile?.name || 'User'}
                        </motion.span>
                        <motion.span
                          className="text-4xl ml-2"
                          animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          style={{ display: 'inline-block', transformOrigin: 'center right' }}
                        >
                          👋
                        </motion.span>
                      </span>
                    </h1>
                    <p className="text-lg text-gray-600 font-medium">Here's your file management dashboard. Keep your files organized and secure.</p>
                  </div>
                  <motion.div
                    className="hidden md:flex w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl items-center justify-center shadow-2xl shadow-blue-500/50 flex-shrink-0"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <i className="bi bi-cloud-check text-white text-5xl"></i>
                  </motion.div>
                </div>
                
                {/* Animated background elements */}
                <motion.div 
                  className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl"
                  animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Stats Grid - Modern Feature Cards */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="bi bi-grid-3x3-gap text-blue-600"></i>
                Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  // Color classes for icon backgrounds
                  const colorClasses = {
                    blue: 'bg-blue-500',
                    green: 'bg-green-500',
                    purple: 'bg-purple-500',
                    pink: 'bg-pink-500'
                  };
                  const iconBg = colorClasses[stat.color] || colorClasses.blue;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <motion.div
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl p-5 transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex flex-col space-y-3">
                          {/* Icon Box */}
                          <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                            <i className={`bi ${stat.icon} text-white text-xl`}></i>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-semibold text-gray-800">
                            {stat.title}
                          </h3>

                          {/* Value */}
                          <div className="mt-1">
                            <p className="text-2xl font-bold text-gray-900">
                              {stat.value}
                            </p>
                          </div>

                          {/* Description/Subtext */}
                          <p className="text-sm text-gray-500 mt-auto">
                            {stat.description}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
               </div>
             </div>

             {/* Main Content Grid - with background blobs */}
            <div className="relative mt-8">
              {/* Decorative Background Blobs */}
              <motion.div
                className="absolute -left-40 top-1/4 w-80 h-80 bg-gradient-to-br from-blue-300/15 to-indigo-300/10 rounded-full blur-3xl pointer-events-none -z-10"
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
                className="absolute -right-32 bottom-0 w-64 h-64 bg-gradient-to-tl from-purple-300/12 to-pink-300/8 rounded-full blur-3xl pointer-events-none -z-10"
                animate={{
                  y: [0, -25, 0],
                  x: [0, -15, 0],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Upload & Files */}
                <div className="lg:col-span-2 space-y-6">
                  {/* File Upload Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gradient-to-r from-indigo-200/40 via-transparent to-purple-200/40">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/40 group-hover:shadow-indigo-500/60 transition-shadow">
                        <i className="bi bi-cloud-arrow-up text-white text-lg"></i>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Upload Files</h2>
                    </div>
                    <UploadForm onFileUploaded={handleFileUploaded} />
                  </motion.div>

                  {/* Divider with gradient */}
                  <motion.div 
                    className="h-px bg-gradient-to-r from-transparent via-gray-300/30 to-transparent"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  />

                  {/* File List Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="group"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gradient-to-r from-purple-200/40 via-transparent to-pink-200/40">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/40 group-hover:shadow-purple-500/60 transition-shadow">
                        <i className="bi bi-files text-white text-lg"></i>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Recent Files</h2>
                    </div>
                    <FileList refreshTrigger={fileRefreshTrigger} />
                  </motion.div>
                </div>

                {/* Right Column - Activity & Stats */}
                <div className="space-y-6">
                  {/* Activity Panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group relative"
                  >
                    {/* Gradient glow */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 opacity-0 group-hover:opacity-15 rounded-3xl blur-xl -z-10"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    />
                    
                    <div className="pb-4 mb-4 border-b border-gray-200/40">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <i className="bi bi-activity text-pink-600"></i>
                        Activity
                      </h2>
                    </div>
                    
                    <Card className="p-4 space-y-2 hover:shadow-2xl transition-all duration-300">
                      <div className="space-y-2">
                        {recentActivity.slice(0, 3).map((activity, index) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="group/activity relative"
                          >
                            <motion.div
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-transparent transition-all duration-200 hover:border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-indigo-50/30 cursor-pointer"
                              whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            >
                              <motion.div
                                className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-400/40"
                                whileHover={{ scale: 1.12 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                              >
                                <i className={`bi ${activity.icon} text-white text-xs`}></i>
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900 truncate group-hover/activity:text-blue-600 transition-colors">{activity.name}</p>
                                <p className="text-xs text-gray-500">{activity.action}</p>
                              </div>
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>

                  {/* Divider */}
                  <motion.div 
                    className="h-px bg-gradient-to-r from-transparent via-gray-300/30 to-transparent"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  />

                  {/* Profile Quick Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="group relative"
                  >
                    {/* Gradient glow */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 rounded-3xl blur-xl -z-10"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 5, repeat: Infinity }}
                    />
                    
                    <div className="pb-4 mb-4 border-b border-gray-200/40">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <i className="bi bi-person-check text-cyan-600"></i>
                        Profile
                      </h2>
                    </div>
                    
                    <Card className="p-4 space-y-3 hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200/40">
                        <span className="text-xs font-semibold text-gray-600">Email</span>
                        <span className="text-xs font-bold text-gray-900 text-right truncate max-w-[120px]">{profile?.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200/40">
                        <span className="text-xs font-semibold text-gray-600">Status</span>
                        {profile?.isAccountVerified ? (
                          <motion.span 
                            className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-gradient-to-r from-green-100/80 to-emerald-100/60 px-2 py-1 rounded-full border border-green-200/60 backdrop-blur-sm" 
                            whileHover={{ scale: 1.08, y: -2 }}
                            animate={{ y: [0, 2, 0] }}
                            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                          >
                            <i className="bi bi-check-circle-fill text-xs"></i>
                            Verified
                          </motion.span>
                        ) : (
                          <motion.span 
                            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-gradient-to-r from-amber-100/80 to-orange-100/60 px-2 py-1 rounded-full border border-amber-200/60 backdrop-blur-sm" 
                            whileHover={{ scale: 1.08, y: -2 }}
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <i className="bi bi-exclamation-circle-fill text-xs"></i>
                            Pending
                          </motion.span>
                        )}
                      </div>
                      <div className="pt-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-600">Completeness</span>
                          <span className="text-sm font-bold gradient-text">
                            {calculateProfileCompleteness()}%
                          </span>
                        </div>
                        <div className="relative h-2 bg-gradient-to-r from-blue-100/80 to-indigo-100/60 rounded-full overflow-hidden border border-blue-200/40 shadow-inner">
                          {/* Shimmer effect background */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            animate={{ x: ['100%', '-100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          />
                          
                          {/* Progress bar */}
                          <motion.div
                            className="relative h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full origin-left"
                            initial={{ width: 0 }}
                            animate={{ width: `${calculateProfileCompleteness()}%` }}
                            transition={{ duration: 1.2, type: 'spring', stiffness: 50, damping: 20 }}
                            style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 2px 6px rgba(59, 130, 246, 0.35)' }}
                          >
                            {/* Inner gradient shine */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </motion.div>
                        </div>
                      </div>
                     </Card>
                   </motion.div>

                   {/* Divider */}
                   <motion.div 
                     className="h-px bg-gradient-to-r from-transparent via-gray-300/30 to-transparent"
                     initial={{ opacity: 0, scaleX: 0 }}
                     animate={{ opacity: 1, scaleX: 1 }}
                     transition={{ delay: 0.5, duration: 0.5 }}
                   />

                   {/* Recent Notes Section */}
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5 }}
                     className="group relative"
                   >
                     <div className="pb-4 mb-4 border-b border-gray-200/40">
                       <div className="flex items-center justify-between">
                         <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                           <i className="bi bi-journal text-amber-600"></i>
                           Recent Notes
                         </h2>
                         <Link
                           to="/notes"
                           className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                         >
                           View All
                         </Link>
                       </div>
                     </div>
                     <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                       {notes.length === 0 ? (
                         <p className="text-sm text-gray-500 text-center py-4">No notes yet</p>
                       ) : (
                         [...notes]
                           .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
                           .slice(0, 5)
                           .map((note, idx) => (
                             <NoteCard
                               key={note.id}
                               note={note}
                               onEdit={handleNoteEdit}
                               onDelete={handleNoteDelete}
                               onTogglePin={handleTogglePin}
                               onToggleLike={handleToggleLike}
                               index={idx}
                             />
                           ))
                       )}
                     </div>
                   </motion.div>
                 </div>
              </div>
            </div>
          </motion.div>
        );
    }
  };

   return (
     <DashboardLayout>
       <div className="w-full flex justify-center bg-gray-50">
         <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
           {renderMainContent()}
         </div>
       </div>

       {/* Note Editor Modal */}
       <NoteEditor
         isOpen={showNoteEditor}
         onClose={closeNoteEditor}
         onSave={handleNoteSave}
         editingNote={editingNote}
       />
     </DashboardLayout>
   );
};

export default Dashboard;