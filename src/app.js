const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const config = require('./config/config');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { connectDB } = require('./db');
const { registerService } = require('./utils/serviceDiscovery');

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', routes);
app.use('/health', (req, res) => res.status(200).json({ status: 'UP' }));

// Error handling
app.use(errorHandler);

// Database connection
connectDB();

// Service discovery
if (config.serviceDiscovery.enabled) {
  registerService();
}

module.exports = app;