import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import NoteEditor from '../components/NoteEditor';
import NoteList from '../components/NoteList';

const Notes = () => {
  const { user: _user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let userId = null;

      try {
        const profileData = await authService.getProfile();
        setProfile(profileData);
        userId = profileData.userId;
      } catch (error) {
        console.error('Failed to load profile:', error);
        setProfile({
          name: 'User',
          email: 'user@example.com',
          userId: 'USER001',
          isAccountVerified: false
        });
        userId = 'USER001';
      }

      const localStorageKey = `localNotes_${userId}`;

      try {
        const notesData = await authService.getNotes();
        // Normalize notes: ensure all required fields present and use 'content' as main field
        const normalizedNotes = notesData.map(note => ({
          ...note,
          pinned: note.pinned || false,
          liked: note.liked || false,
          likeCount: note.likeCount || (note.liked ? 1 : 0),
          content: note.content || note.description || ''
        }));
        setNotes(normalizedNotes);
        localStorage.setItem(localStorageKey, JSON.stringify(normalizedNotes));
      } catch (error) {
        console.error('Failed to load notes from backend:', error);
        const localNotes = localStorage.getItem(localStorageKey);
        if (localNotes) {
          const parsedNotes = JSON.parse(localNotes);
          const normalizedNotes = parsedNotes.map(note => ({
            ...note,
            pinned: note.pinned || false,
            liked: note.liked || false,
            likeCount: note.likeCount || (note.liked ? 1 : 0),
            content: note.content || note.description || ''
          }));
          setNotes(normalizedNotes);
        } else {
          setNotes([]);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleCreateNote = () => {
    setEditingNote(null);
    setShowNoteEditor(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowNoteEditor(true);
  };

  const closeNoteEditor = () => {
    setShowNoteEditor(false);
    setEditingNote(null);
  };

  const handleNoteSave = async (noteData) => {
    const { title, description } = noteData;
    const content = description;
    const userId = profile?.userId || 'USER001';
    const localStorageKey = `localNotes_${userId}`;

    try {
      if (editingNote) {
        // Update existing note
        await authService.updateNote(editingNote.id, { title, content });
        const updatedNotes = notes.map(n =>
          n.id === editingNote.id
            ? { ...n, title, content, description: content }
            : n
        );
        setNotes(updatedNotes);
        localStorage.setItem(localStorageKey, JSON.stringify(updatedNotes));
        toast.success('Note updated successfully');
      } else {
        // Create new note
        const newNote = await authService.createNote({ title, content });
        const normalizedNewNote = {
          ...newNote,
          pinned: newNote.pinned || false,
          liked: newNote.liked || false,
          likeCount: newNote.likeCount || 0,
          content: newNote.content || content,
          description: content
        };
        const updatedNotes = [normalizedNewNote, ...notes];
        setNotes(updatedNotes);
        localStorage.setItem(localStorageKey, JSON.stringify(updatedNotes));
        toast.success('Note created successfully');
      }
    } catch (error) {
      console.error('Backend operation failed, saving locally:', error);
      if (editingNote) {
        const updatedNotes = notes.map(n =>
          n.id === editingNote.id
            ? { ...n, title, content, description: content, updatedAt: new Date().toISOString() }
            : n
        );
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
        setNotes([localNote, ...notes]);
        const currentNotes = localStorage.getItem(localStorageKey);
        const parsedNotes = currentNotes ? JSON.parse(currentNotes) : [];
        localStorage.setItem(localStorageKey, JSON.stringify([localNote, ...parsedNotes]));
        toast.success('Note created locally (backend unavailable)');
      }
    }

    closeNoteEditor();
  };

  const handleDeleteNote = async (id) => {
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

  const pinnedCount = notes.filter(n => n.pinned).length;
  const totalLikes = notes.reduce((sum, n) => sum + (n.likeCount || 0), 0);

  return (
    <DashboardLayout>
      <div className="w-full flex justify-center relative overflow-hidden">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 -z-10" />

        {/* Subtle decorative blur blobs */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl -z-10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 -left-32 w-64 h-64 bg-indigo-300/10 rounded-full blur-3xl -z-10"
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 right-1/4 w-72 h-72 bg-purple-300/10 rounded-full blur-3xl -z-10"
          animate={{ x: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="max-w-6xl w-full px-6 py-8">
          {/* Section Header */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  <motion.span
                    className="text-4xl"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    📝
                  </motion.span>
                  My Notes
                </h1>
                <p className="text-gray-500 text-sm">
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'} • Pin important notes and like your favorites
                </p>
              </div>
              <Button
                variant="primary"
                onClick={handleCreateNote}
                className="self-start md:self-auto"
              >
                <i className="bi bi-plus-lg mr-2" />
                New Note
              </Button>
            </div>
          </motion.div>

          {/* Notes Grid */}
          <NoteList
            notes={notes}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
            onTogglePin={handleTogglePin}
            onToggleLike={handleToggleLike}
            isLoading={isLoading}
          />
        </div>

        {/* Note Editor Modal */}
        <NoteEditor
          isOpen={showNoteEditor}
          onClose={closeNoteEditor}
          onSave={handleNoteSave}
          editingNote={editingNote}
        />
      </div>
    </DashboardLayout>
  );
};

export default Notes;
