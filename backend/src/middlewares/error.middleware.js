import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If it's not an instance of ApiError, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  const response = {
    success: false,
    status: error.statusCode,
    message: error.message,
    errors: error.errors || [],
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  logger.error(
    `${req.method} ${req.url} - Status: ${error.statusCode} - Message: ${error.message} - Errors: ${JSON.stringify(
      error.errors
    )}`
  );

  res.status(error.statusCode).json(response);
};
export default errorHandler;
