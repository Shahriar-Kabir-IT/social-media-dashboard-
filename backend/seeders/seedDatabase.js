// backend/seeders/seedDatabase.js
const { sequelize } = require('../config/db');
const { User } = require('../models/User');  // Directly import User model

async function seedDatabase() {
  try {
    // Sync all models
    await sequelize.sync({ force: true });
    
    // Create test users
    await User.bulkCreate([
      {
        username: 'ceo@example.com',
        password: 'ceo123',  // Will be automatically hashed by the model
        role: 'ceo',
        full_name: 'John CEO',
        email: 'ceo@example.com'
      },
      {
        username: 'manager@example.com',
        password: 'manager123',
        role: 'manager',
        full_name: 'Jane Manager',
        email: 'manager@example.com'
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();