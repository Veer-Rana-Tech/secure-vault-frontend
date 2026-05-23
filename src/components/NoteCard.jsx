import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const NoteCard = ({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleLike,
  index = 0
}) => {
  const handlePin = (e) => {
    e.stopPropagation();
    onTogglePin(note.id, !note.pinned);
    toast.success(note.pinned ? 'Note unpinned' : 'Note pinned');
  };

  const handleLike = (e) => {
    e.stopPropagation();
    onToggleLike(note.id, !note.liked);
    toast.success(note.liked ? 'Like removed' : 'Note liked');
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(note);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  return (
    <motion.div
      className="
        bg-white/80 backdrop-blur-md
        border border-gray-200
        shadow-md hover:shadow-xl
        rounded-2xl p-5
        relative overflow-hidden
        transition-all duration-300
        group
      "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, translateY: -4 }}
    >
      {/* Top-left emoji/icon */}
      <motion.div
        className="absolute -top-2 -left-2 w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-md border border-white/50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.05 + 0.1, type: 'spring', stiffness: 300 }}
      >
        <span className="text-lg">📝</span>
      </motion.div>

      {/* Top section: Title + Pin/Badge */}
      <div className="flex items-start justify-between mb-3 pt-2">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 leading-tight pr-2">
            {note.title}
          </h3>
          {note.pinned && (
            <motion.div
              className="mt-2 inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-semibold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 + 0.2 }}
            >
              <i className="bi bi-star-fill text-xs" />
              Pinned
            </motion.div>
          )}
        </div>
        <motion.button
          onClick={handlePin}
          className={`p-2 rounded-xl transition-colors duration-200 ${
            note.pinned
              ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-600'
              : 'bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={note.pinned ? 'Unpin' : 'Pin'}
        >
          <i className={`bi ${note.pinned ? 'bi-star-fill' : 'bi-star'} text-lg`}></i>
        </motion.button>
      </div>

      {/* Middle: Description/Content */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
          {note.content || 'No description'}
        </p>
      </div>

      {/* Bottom: Actions */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        {/* Like Button with heart emoji */}
        <motion.button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            note.liked
              ? 'bg-red-50 text-red-500'
              : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="text-base"
            animate={note.liked ? {
              scale: [1, 1.3, 1],
            } : {}}
            transition={{ duration: 0.3 }}
          >
            {note.liked ? '❤️' : '🤍'}
          </motion.span>
          <span className="text-xs">{note.likeCount || (note.liked ? 1 : 0)}</span>
        </motion.button>

        {/* Edit Button with icon */}
        <motion.button
          onClick={handleEdit}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Edit"
        >
          <i className="bi bi-pencil text-base" />
          <span className="text-xs">Edit</span>
        </motion.button>

        {/* Delete Button with icon */}
        <motion.button
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Delete"
        >
          <i className="bi bi-trash text-base" />
          <span className="text-xs">Delete</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NoteCard;
