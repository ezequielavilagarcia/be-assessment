const express = require('express');

const errorHandler = require('./middlewares/error-handler');

const { clientRoutes} = require('./routes');

const app = express();

app.use('/clients', clientRoutes);

app.use(errorHandler());

app.listen(3000);

module.exports = app;
