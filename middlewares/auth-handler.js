const jwt = require('jsonwebtoken');

const { ADMIN_ROLE } = require('../utils/auth.constants');
const {
  AUTH_FORBIDDEN_MESSAGE,
  AUTH_UNAUTHORIZED_MESSAGE
} = require('../utils/messages.constants');
const {
  FORBIDDEN_CODE,
  UNAUTHORIZED_CODE,
  INTERNAL_ERROR_CODE
} = require('../utils/api.constants');

exports.isAuth = (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization');

    if (!authorizationHeader) {
      const error = new Error(AUTH_UNAUTHORIZED_MESSAGE);
      error.statusCode = UNAUTHORIZED_CODE;
      throw error;
    }

    const token = authorizationHeader.replace('Bearer ', '');
    const decodedToken = jwt.verify(token, process.env.JWT_PASSWORD);

    if (!decodedToken) {
      const error = new Error(AUTH_UNAUTHORIZED_MESSAGE);
      error.statusCode = UNAUTHORIZED_CODE;
      throw error;
    }

    req.role = decodedToken.role;
    next();
  } catch (err) {
    err.statusCode = err.statusCode || INTERNAL_ERROR_CODE;
    next(err);
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (req.role !== ADMIN_ROLE) {
      const error = new Error(AUTH_FORBIDDEN_MESSAGE);
      error.statusCode = FORBIDDEN_CODE;
      throw error;
    }
    next();
  } catch (err) {
    err.statusCode = err.statusCode || INTERNAL_ERROR_CODE;
    next(err);
  }
};
