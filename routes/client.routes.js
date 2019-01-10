const express = require('express');

const { clientController } = require('../controllers');

const router = express.Router();

router.get('/:id', clientController.getClientById);

module.exports = router;
