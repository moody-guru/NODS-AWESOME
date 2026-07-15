const Note = require('../models/Note');
const AppError = require('../utils/AppError');

exports.getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, count: notes.length, notes });
  } catch (error) {
    next(error);
  }
};

exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return next(new AppError('Note not found.', 404));
    }

    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ title, content, user: req.user._id });
    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content },
      { new: true, runValidators: true }
    );

    if (!note) {
      return next(new AppError('Note not found.', 404));
    }

    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return next(new AppError('Note not found.', 404));
    }

    res.status(200).json({ success: true, message: 'Note deleted.' });
  } catch (error) {
    next(error);
  }
};
