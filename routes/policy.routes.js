const express = require('express');

const { policyController } = require('../controllers');
const { isAdmin, isAuth } = require('../middlewares/auth-handler');

const router = express.Router();

router.get('/:policyId/client', isAuth, isAdmin, policyController.getPolicyByIdWithClientLinked);

module.exports = router;
