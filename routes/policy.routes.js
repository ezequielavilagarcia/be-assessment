const express = require('express');

const { policyController } = require('../controllers');

const router = express.Router();

router.get('/:policyId/client', policyController.getPolicyByIdWithClientLinked);

module.exports = router;
