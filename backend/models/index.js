const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = require('./User')(sequelize, DataTypes);
const Post = require('./post')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);

// Set up associations
User.associate({ Post, Notification });
Post.associate({ User });
Notification.associate({ User });

module.exports = {
  sequelize,
  User,
  Post,
  Notification
};