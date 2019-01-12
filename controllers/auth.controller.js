const jwt = require('jsonwebtoken');

const { Client } = require('../models');
const { UNAUTHORIZED_CODE, SUCCESS_CODE, INTERNAL_ERROR_CODE } = require('../utils/api.constants');
const {
  AUTH_UNAUTHORIZED_MESSAGE,
  AUTH_LOGIN_SUCCESS_MESSAGE
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
  const email = req.body.email;
  try {
    const user = await Client.find({ email });
    if (user == null) {
      const error = new Error(AUTH_UNAUTHORIZED_MESSAGE);

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
