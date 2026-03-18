require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./src/models/Event');
const Society = require('./src/models/Society');
const eventsData = require('./src/mockData/events.json');
const societiesData = require('./src/mockData/societies.json');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data (optional, but good for fresh start)
    await Event.deleteMany({});
    await Society.deleteMany({});

    // 1. Insert Societies
    const societyMap = {};

    for (const s of societiesData) {
      const society = new Society({
        name: s.name,
        shortName: s.shortName,
        description: s.description,
        logo: s.logo,
        leader: s.leader,
        followersCount: s.followersCount
      });
      const savedSociety = await society.save();
      societyMap[s._id] = savedSociety._id;
    }
    console.log('Societies seeded!');

    // 2. Insert Events
    const eventsToInsert = eventsData.map(e => ({
      title: e.title,
      date: new Date(e.date),
      society: societyMap[e.society] || e.society, // Use mapped ObjectId if available
      bannerImage: e.bannerImage,
      createdAt: e.createdAt ? new Date(e.createdAt) : new Date()
    }));

    await Event.insertMany(eventsToInsert);
    console.log('Events seeded!');

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
