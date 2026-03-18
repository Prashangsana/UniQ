require('dotenv').config();
const mongoose = require('mongoose');
const Society = require('./src/models/Society');
const Event = require('./src/models/Event');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const societyCount = await Society.countDocuments();
    const eventCount = await Event.countDocuments();
    console.log(`Societies in DB: ${societyCount}`);
    console.log(`Events in DB: ${eventCount}`);
    
    if (societyCount > 0) {
      const societies = await Society.find().limit(2);
      console.log('Sample societies:', JSON.stringify(societies, null, 2));
    }
    
    process.exit();
  } catch (error) {
    console.error('Error checking DB:', error);
    process.exit(1);
  }
};

checkDB();
