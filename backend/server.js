require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { Sequelize } = require('sequelize');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');

// Initialize Express
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
const User = require('./models/User');
const Post = require('./models/Post');
const Notification = require('./models/Notification');

// Initialize models
const UserModel = User(sequelize);
const PostModel = Post(sequelize);
const NotificationModel = Notification(sequelize);

// Set up model associations
UserModel.hasMany(PostModel, { foreignKey: 'user_id' });
PostModel.belongsTo(UserModel, { foreignKey: 'user_id' });
UserModel.hasMany(NotificationModel, { foreignKey: 'user_id' });
NotificationModel.belongsTo(UserModel, { foreignKey: 'user_id' });

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Logging
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
      force: false
    };
    await sequelize.sync(syncOptions);
    console.log('Database synced successfully');

    // Load routes after DB is ready
    const routes = require('./routes');
    app.use('/api', routes);

    // Error handling
    app.use(errorHandler);

    // Start server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Error handlers
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection:', err);
      server.close(() => process.exit(1));
    });

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