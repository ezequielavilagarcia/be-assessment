const { Client, Policy } = require('../models');
const { NOT_FOUND_CODE, SUCCESS_CODE, INTERNAL_ERROR_CODE } = require('../utils/api.constants');
const {
  CLIENT_FOUNDED_MESSAGE,
  CLIENT_NOT_FOUNDED_MESSAGE,
  POLICIES_FOUNDED_MESSAGE,
  POLICIES_NOT_FOUNDED_MESSAGE
} = require('../utils/messages.constants');

exports.getClientById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const client = await Client.find({ id });

    if (client == null) {
      const error = new Error(CLIENT_NOT_FOUNDED_MESSAGE);
      error.statusCode = NOT_FOUND_CODE;
      throw error;
    }

    const message = CLIENT_FOUNDED_MESSAGE;

    res.status(SUCCESS_CODE).json({ message, client });
  } catch (err) {
    err.statusCode = err.statusCode || INTERNAL_ERROR_CODE;

    next(err);
  }
};

exports.getClientByName = async (req, res, next) => {
  try {
    const name = req.params.name;
    const client = await Client.find({ name });

    if (client == null) {
      const error = new Error(CLIENT_NOT_FOUNDED_MESSAGE);
      error.statusCode = NOT_FOUND_CODE;
      throw error;
    }

    const message = CLIENT_FOUNDED_MESSAGE;

    res.status(SUCCESS_CODE).json({ message, client });
  } catch (err) {
    err.statusCode = err.statusCode || INTERNAL_ERROR_CODE;

    next(err);
  }
};

exports.getClientPolicies = async (req, res, next) => {
  try {
    const name = req.params.name;
    const client = await Client.find({ name });

    if (client == null) {
      const error = new Error(CLIENT_NOT_FOUNDED_MESSAGE);
      error.statusCode = NOT_FOUND_CODE;
      throw error;
    }

    const policies = await Policy.find({ clientId: client.id });

    let message = POLICIES_FOUNDED_MESSAGE;
    let code = SUCCESS_CODE;

    if (policies.length === 0) {
      message = POLICIES_NOT_FOUNDED_MESSAGE;
      code = NOT_FOUND_CODE;
    }

    res.status(code).json({ message, client, policies });
  } catch (err) {
    err.statusCode = err.statusCode || INTERNAL_ERROR_CODE;

    next(err);
  }
};
