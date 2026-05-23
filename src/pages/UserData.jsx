import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { toast } from 'react-toastify';

const UserData = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  useEffect(() => {
    // Load user notes from localStorage (since we don't have backend for this)
    const loadUserNotes = () => {
      try {
        const userNotesKey = `localNotes_${user?.userId || 'default'}`;
        const savedNotes = localStorage.getItem(userNotesKey);
        if (savedNotes) {
          setNotes(JSON.parse(savedNotes));
        } else {
          // Default sample notes
          const defaultNotes = [
            {
              id: 1,
              title: 'Welcome Note',
              content: 'Welcome to Authify! This is your personal notes section.',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              starred: false
            },
            {
              id: 2,
              title: 'Security Reminder',
              content: 'Remember to keep your password secure and enable two-factor authentication.',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              starred: true
            }
          ];
          setNotes(defaultNotes);
          localStorage.setItem(userNotesKey, JSON.stringify(defaultNotes));
        }
      } catch (error) {
        console.error('Error loading notes:', error);
        toast.error('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    loadUserNotes();
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleStarNote = (noteId) => {
    const userId = user?.userId || 'default';
    const localStorageKey = `localNotes_${userId}`;

    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, starred: !note.starred, updatedAt: new Date().toISOString() }
        : note
    );

    setNotes(updatedNotes);
    localStorage.setItem(localStorageKey, JSON.stringify(updatedNotes));
  };

  const displayedNotes = showStarredOnly
    ? notes.filter(note => note.starred)
    : [...notes].sort((a, b) => {
        // Starred notes come first
        if (a.starred && !b.starred) return -1;
        if (!a.starred && b.starred) return 1;
        // If both starred or both not starred, sort by creation date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <Header />

      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 text-white rounded-3xl shadow-md mx-auto mb-6">
              <i className="bi bi-person-lines-fill text-3xl"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">Your Data</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore your personal notes, account insights, and data overview.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                {notes.length} Notes
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                {user?.isAccountVerified ? 'Verified account' : 'Unverified account'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
             <div>
               <h2 className="text-3xl font-semibold text-slate-900 mb-2">Your Saved Notes</h2>
               <p className="text-sm text-slate-600">Manage your notes and access account insights in one place.</p>
             </div>
             <button
               onClick={() => setShowStarredOnly(!showStarredOnly)}
               className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
                 showStarredOnly
                   ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:scale-105'
                   : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:scale-105'
               }`}
             >
               <i className={`bi ${showStarredOnly ? 'bi-star-fill' : 'bi-star'} text-base`}></i>
               {showStarredOnly ? 'Show All' : 'Starred Only'}
             </button>
           </div>

            {displayedNotes.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                <div className="mb-4 text-4xl text-slate-400">
                  <i className={`bi ${showStarredOnly ? 'bi-star' : 'bi-sticky'}`}></i>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {showStarredOnly ? 'No starred notes yet' : 'No notes yet'}
                </h3>
                <p className="text-sm text-slate-500">
                  {showStarredOnly
                    ? 'Star important notes to keep them front and center.'
                    : 'Your saved notes will appear here as soon as you create them.'
                  }
                </p>
                 {showStarredOnly && (
                   <button
                     onClick={() => setShowStarredOnly(false)}
                     className="mt-6 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 hover:scale-105 transition-all"
                   >
                     Show All Notes
                   </button>
                 )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {displayedNotes.map((note) => {
                  return (
                    <div key={note.id} className="bg-slate-50 rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{note.title}</h3>
                          <p className="text-sm text-slate-500 mt-1">{formatDate(note.createdAt)}</p>
                        </div>
                        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${note.starred ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-700'}`}>
                          {note.starred ? 'Starred' : 'Note'}
                        </div>
                      </div>

                      <p className="text-slate-600 leading-relaxed mb-6">{note.content}</p>

                      <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <i className="bi bi-clock"></i>
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                        {note.updatedAt !== note.createdAt && (
                          <div className="flex items-center gap-2">
                            <i className="bi bi-pencil"></i>
                            <span>Updated</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-3">
                        <button
                          onClick={() => toggleStarNote(note.id)}
                          className={`inline-flex items-center justify-center rounded-2xl border px-3 py-2 text-sm font-semibold transition ${note.starred ? 'border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                          title={note.starred ? 'Remove from starred' : 'Mark as important'}
                        >
                          <i className={`bi ${note.starred ? 'bi-star-fill' : 'bi-star'}`}></i>
                        </button>
                        <span className="text-xs text-slate-500">
                          {note.content.length > 100 ? 'Detailed note' : 'Quick note'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Enhanced Data Summary */}
          <div className="mt-10 border-t border-slate-200 pt-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-slate-900 mb-3">
                Data Insights
              </h2>
              <p className="text-slate-600 text-lg font-medium">Your account overview at a glance</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-sm">
                    <i className="bi bi-sticky text-xl"></i>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-900">{notes.length}</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Saved Notes</h3>
                <p className="text-slate-600 text-sm">Personal notes & reminders</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-green-600 text-white shadow-sm">
                    <i className={`bi ${user?.isAccountVerified ? 'bi-shield-check' : 'bi-shield-x'} text-xl`}></i>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${user?.isAccountVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user?.isAccountVerified ? 'Verified' : 'Unverified'}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Account Status</h3>
                <p className="text-slate-600 text-sm">Security & verification</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-sm">
                    <i className="bi bi-calendar-event text-xl"></i>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-900">
                      {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
                    </p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Member Since</h3>
                <p className="text-slate-600 text-sm">Account creation year.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserData;