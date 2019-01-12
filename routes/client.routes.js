const express = require('express');

const { clientController } = require('../controllers');
const { isAdmin, isAuth } = require('../middlewares/auth-handler');

const router = express.Router();

router.get('/:id', isAuth, clientController.getClientById);
router.get('/filter/:name', isAuth, clientController.getClientByName);
router.get('/:name/policies', isAuth, isAdmin, clientController.getClientPolicies);

module.exports = router;
