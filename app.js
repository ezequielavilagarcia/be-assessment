const express = require('express');

const allowCORS = require('./middlewares/allow-cors');
const errorHandler = require('./middlewares/error-handler');

const { clientRoutes, policyRoutes } = require('./routes');

const app = express();

app.use(allowCORS());

app.use('/clients', clientRoutes);
app.use('/policies', policyRoutes);

app.use(errorHandler());

app.listen(3000);

module.exports = app;
