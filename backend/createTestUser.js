require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

// Temporary User model matching your schema
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('ceo', 'manager'),
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Create test user
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ force: false });
    
    // Create test CEO user
    const testUser = await User.create({
      name: 'Test CEO',
      email: 'ceo@example.com',
      password: 'admin123', // Will be hashed automatically
      role: 'ceo'
    });

    // Create test Manager user
    await User.create({
      name: 'Test Manager',
      email: 'manager@example.com',
      password: 'manager123',
      role: 'manager'
    });

    console.log('Test users created successfully:');
    console.log('CEO:', testUser.email, '| Password: admin123');
    console.log('Manager:', 'manager@example.com', '| Password: manager123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  }
})();