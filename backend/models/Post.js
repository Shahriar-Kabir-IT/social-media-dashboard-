const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    platform: {
      type: DataTypes.ENUM('facebook', 'twitter', 'instagram', 'linkedin', 'youtube'),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    media_url: {
      type: DataTypes.STRING(255)
    },
    media_type: {
      type: DataTypes.STRING(50)
    },
    scheduled_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'published'),
      defaultValue: 'pending'
    },
    rejection_reason: {
      type: DataTypes.TEXT
    },
    published_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Post;
};