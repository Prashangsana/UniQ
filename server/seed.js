require('dotenv').config();
const mongoose = require('mongoose');
// const Event = require('./src/models/Event');
// const Society = require('./src/models/Society');
const User = require('./src/models/User');
const Module = require('./src/models/Module');

// const eventsData = require('./src/mockData/events.json');
// const societiesData = require('./src/mockData/societies.json');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Define the real IDs from database
    const LECTURER_ID = "69be8cebbc176eb561e10766"; // Nilakshi
    const STUDENT_ID = "69bf99106b7da0a63541b001"; // Prabhavi

    // Clear existing data (optional, but good for fresh start)
    // await Event.deleteMany({});
    // await Society.deleteMany({});
    // await User.deleteMany({});
    await Module.deleteMany({});

    // Create a Module linked to Lecturer
    const seModule = await Module.create({
      _id: '5COSC019C', // The module code
      name: 'Software Engineering Group Project',
      moduleLeaders: [LECTURER_ID], // Now Nilakshi is authorized
      moduleTeam: []
    });

    console.log(`Module ${seModule._id} seeded and assigned to Nilakshi!`);

    await User.findByIdAndUpdate(STUDENT_ID, {
      skills: ["Node.js", "React", "MongoDB", "UI/UX Design"],
      bio: "Software Engineering student interested in Full-stack development."
    })

    // 1. Insert Societies
    // const societyMap = {};

    /*
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
    */

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
