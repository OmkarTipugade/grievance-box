/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Log error for server-side debugging
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    error: true,
  });
};

module.exports = errorHandler;
