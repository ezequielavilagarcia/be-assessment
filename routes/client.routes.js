const express = require('express');

const { clientController } = require('../controllers');

const router = express.Router();

router.get('/:id', clientController.getClientById);
router.get('/filter/:name', clientController.getClientByName);

module.exports = router;
