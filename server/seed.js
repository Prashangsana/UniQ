require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./src/models/Event');
const Society = require('./src/models/Society');
const User = require('./src/models/User');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data (optional, but good for fresh start)
    await Event.deleteMany({});
    await Society.deleteMany({});
    await User.deleteMany({});

    console.log('Database cleared and ready for real data!');
    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
