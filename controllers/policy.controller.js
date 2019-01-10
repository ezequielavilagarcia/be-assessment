const { Client, Policy } = require('../models');
const { NOT_FOUND_CODE, SUCCESS_CODE, INTERNAL_ERROR_CODE } = require('../utils/api.constants');
const {
  POLICY_NOT_FOUNDED_MESSAGE,
  POLICY_CLIENT_NOT_FOUNDED_MESSAGE,
  CLIENT_FOUNDED_MESSAGE
} = require('../utils/messages.constants');

exports.getPolicyByIdWithClientLinked = async (req, res, next) => {
  try {
    const id = req.params.policyId;
    const policies = await Policy.find({ id });

    if (policies.length === 0) {
      const error = new Error(POLICY_NOT_FOUNDED_MESSAGE);
      error.statusCode = NOT_FOUND_CODE;
      throw error;
    }

    const policy = policies[0];

    const client = await Client.find({ id: policy.clientId });

    if (client == null) {
      const error = new Error(POLICY_CLIENT_NOT_FOUNDED_MESSAGE);
      error.statusCode = NOT_FOUND_CODE;
      throw error;
    }

    const message = CLIENT_FOUNDED_MESSAGE;

    res.status(SUCCESS_CODE).json({ message, policy, client });
  } catch (err) {
    err.statusCode = err.statusCode || INTERNAL_ERROR_CODE;
    next(err);
  }
};
