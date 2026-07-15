const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join('. ');
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for ${field}. Please use another.`;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format.';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
