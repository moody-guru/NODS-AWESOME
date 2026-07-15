const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      default: '',
      maxlength: [10000, 'Content cannot exceed 10000 characters'],
    },
  },
  { timestamps: true }
);

noteSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Note', noteSchema);
