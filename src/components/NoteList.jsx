import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NoteCard from './NoteCard';

const NoteList = ({
  notes,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleLike,
  isLoading = false
}) => {
  // Sort: pinned notes first
  const sortedNotes = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <motion.div
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="mt-4 text-gray-500 font-medium">Loading notes...</p>
      </div>
    );
  }

  if (sortedNotes.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <i className="bi bi-journal-x text-5xl text-gray-400" />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No notes yet</h3>
        <p className="text-gray-500 max-w-md">
          Create your first note to get started. You can pin important notes and like your favorites.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {sortedNotes.map((note, index) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
            onTogglePin={onTogglePin}
            onToggleLike={onToggleLike}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NoteList;
