const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const allowCORS = require('./middlewares/allow-cors');
const errorHandler = require('./middlewares/error-handler');

const { clientRoutes, policyRoutes, authRoutes } = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(allowCORS());

app.use('/auth', authRoutes);
app.use('/clients', clientRoutes);
app.use('/policies', policyRoutes);

app.use(errorHandler());

app.listen(process.env.PORT);

module.exports = app;
