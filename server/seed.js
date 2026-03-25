require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Module = require('./src/models/Module');
const Group = require('./src/models/Group'); 
const GroupInvite = require('./src/models/GroupInvite');
const JoinRequest = require('./src/models/JoinRequest'); 

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    const LECTURER_ID = "69be8cebbc176eb561e10766"; 
    const STUDENT_ID = "69bf99106b7da0a63541b001"; 
    const REQUESTER_ID = "69bf6d8dc268dc124488ebf6";

    // Clear existing to prevent duplicates
    await Module.deleteMany({});
    await Group.deleteMany({});
    await GroupInvite.deleteMany({});
    await JoinRequest.deleteMany({});

    // 1. Create Module
    const seModule = await Module.create({
      _id: '5COSC019C',
      name: 'Software Engineering Group Project',
      moduleLeaders: [LECTURER_ID]
    });

    // 2. Create a Group (Nilakshi as leader for testing)
    const testGroup = await Group.create({
      name: "Alpha Developers",
      domain: "FinTech",
      moduleId: seModule._id,
      leader: LECTURER_ID,
      members: [LECTURER_ID],
      maxMembers: 3,
      status: 'open'
    });

    // 3. Create a Manual Invite to Prabhavi
    await GroupInvite.create({
      group: testGroup._id,
      invitedUser: STUDENT_ID,
      message: "Hey Prabhavi! We saw your React skills and want you in Alpha Developers.",
      status: 'pending'
    });

    await JoinRequest.create({
      group: testGroup._id,
      requester: REQUESTER_ID,
      status: 'pending',
      approvals: [] // No one has voted yet
    });

    // Update Prabhavi's skills
    await User.findByIdAndUpdate(STUDENT_ID, {
      skills: ["Node.js", "React", "MongoDB", "UI/UX Design"],
      bio: "Software Engineering student interested in Full-stack development."
    });

    console.log('Seeding complete: Module, Group, and Invite and Join Request created!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();