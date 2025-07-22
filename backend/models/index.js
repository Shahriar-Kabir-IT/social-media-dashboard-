const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = require('./User')(sequelize, DataTypes);
const Post = require('./Post')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);

// Set up associations
User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Post,
  Notification
};