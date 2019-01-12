const express = require('express');
const bodyParser = require('body-parser');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const helmet = require('helmet');

require('dotenv').config();

const allowCORS = require('./middlewares/allow-cors');
const errorHandler = require('./middlewares/error-handler');

const { clientRoutes, policyRoutes, authRoutes } = require('./routes');
const { API_BASE_URL } = require('./utils/api.constants');

const app = express();

const api = express.Router();

app.use(API_BASE_URL, api);

api.use(bodyParser.json());
api.use(allowCORS());
api.use(helmet());

api.use('/auth', authRoutes);
api.use('/clients', clientRoutes);
api.use('/policies', policyRoutes);
api.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
api.use(errorHandler());

app.listen(process.env.PORT);

module.exports = app;
