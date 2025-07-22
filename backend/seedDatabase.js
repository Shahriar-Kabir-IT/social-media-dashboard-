// backend/seedDatabase.js (in root of backend folder)
const { sequelize } = require('./config/db');
const UserModel = require('./models/User');
const User = UserModel(sequelize);

async function seed() {
  try {
    // Sync all models
    await sequelize.sync({ force: true });
    
    // Create test users
    await User.bulkCreate([
      {
        username: 'ceo@example.com',
        password: 'ceo123',
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

seed();