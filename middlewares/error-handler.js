const {INTERNAL_ERROR_CODE} = require('../utils/api.constants')

/**
 * This middleware is used to handle all the errors in the server.
 * It should be used as the last middleware
 */
module.exports = () => (error, req, res, next) => {
  const status = error.statusCode || INTERNAL_ERROR_CODE;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message,
    data
  });
};
