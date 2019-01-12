const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');

const { Client } = require('../models');
const {
  UNAUTHORIZED_CODE,
  SUCCESS_CODE,
  INTERNAL_ERROR_CODE,
  VALIDATION_FAILED_CODE
} = require('../utils/api.constants');
const {
  AUTH_USER_NOT_EXISTS_MESSAGE,
  AUTH_LOGIN_SUCCESS_MESSAGE,
  AUTH_VALIDATION_FAILED_MESSAGE
} = require('../utils/messages.constants');
const { expiresIn } = require('../utils/token.constants');

/**
 * Login by any client email without password and this return a token to use in the app.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error(AUTH_VALIDATION_FAILED_MESSAGE);
      error.statusCode = VALIDATION_FAILED_CODE;
      error.data = errors.array();
      throw error;
    }

    const email = req.body.email;

    const user = await Client.find({ email });
    if (user == null) {
      const error = new Error(AUTH_USER_NOT_EXISTS_MESSAGE);

      error.statusCode = UNAUTHORIZED_CODE;

      throw error;
    }

    const message = AUTH_LOGIN_SUCCESS_MESSAGE;
    const token = jwt.sign({ email, role: user.role }, process.env.JWT_PASSWORD, { expiresIn });

    res.status(SUCCESS_CODE).json({ message, token, user });
  } catch (err) {
    err.statusCode = err.statusCode || INTERNAL_ERROR_CODE;
    next(err);
  }
};
