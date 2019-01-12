const express = require('express');
const { body } = require('express-validator/check');

const { authController } = require('../controllers');

const router = express.Router();

router.post(
  '/login',
  body('email', 'Please enter a valid email.')
    .isEmail()
    .normalizeEmail(),
  authController.login
);

module.exports = router;
