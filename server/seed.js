require('dotenv').config();
const mongoose = require('mongoose');

// Models from both branches
const User = require('./src/models/User');
const Module = require('./src/models/Module');
const Group = require('./src/models/Group'); 
const GroupInvite = require('./src/models/GroupInvite');
const JoinRequest = require('./src/models/JoinRequest'); 
const Event = require('./src/models/Event');

// Mock Data from main
const eventsData = require('./src/mockData/events.json');
const societiesData = require('./src/mockData/societies.json');
const mockUsers = require('./src/mockData/mockUsers');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');
    
    console.log('Seeding complete!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();