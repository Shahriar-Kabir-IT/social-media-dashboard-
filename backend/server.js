require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');

// Initialize Express app
const app = express();

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import model definitions
const defineUser = require('./models/User');
const definePost = require('./models/Post');
const defineNotification = require('./models/Notification');

// Initialize models
const User = defineUser(sequelize, DataTypes);
const Post = definePost(sequelize, DataTypes);
const Notification = defineNotification(sequelize, DataTypes);

// Set up model associations
User.associate({ Post, Notification });
Post.associate({ User });
Notification.associate({ User });

// Middleware setup
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(logger);
}

// Database connection and sync
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    const syncOptions = {
      alter: process.env.NODE_ENV === 'development',
      force: false // Never use force: true in production!
    };
    
    await sequelize.sync(syncOptions);
    console.log('Database synced successfully');

    // Import routes after DB is ready
    const routes = require('./routes');
    app.use('/api', routes);

    // Error handling - must be last middleware
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      server.close(() => process.exit(1));
    });

  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;