const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true
  },
  img: {
    type: String, // Base64 strings can be very long
    default: 'https://varthana.com/school/wp-content/uploads/2023/08/B512.jpg'
  },
  moduleId: {
    // Using String to match your frontend mock data (e.g., '5COSC021')
    // If you have a Module collection, change this to: type: mongoose.Schema.Types.ObjectId, ref: 'Module'
    type: String,
    required: [true, 'Module ID is required']
  },
  domain: {
    type: String,
    required: [true, 'Project domain is required']
  },
  members: [{
    // Array of ObjectIds referencing the User model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxMembers: {
    type: Number,
    required: [true, 'Maximum number of members is required'],
    min: [1, 'Group must have at least 1 member capacity']
  },
  deadlines: [{
    title: { type: String, required: true },
    date: { type: String, required: true } // Or use Date type for better sorting
  }],

  // --- NEW FIELDS FOR LECTURER FINALISATION ---

  // The specific prefix the students selected (e.g., "SE")
  prefix: {
    type: String
  },
  // The final generated ID (e.g., "SE-1")
  finalisedCode: {
    type: String
  },
  // Tracks where the group is in the review process
  status: {
    type: String,
    enum: ['open', 'pending_review', 'finalised'],
    default: 'open'
  },
  // Stores the form data (IIT IDs, UoW IDs, Phone numbers, Tutorial Groups)
  finalisationForm: {
    tutorialGroup: { type: String },
    memberExtraInfo: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      iitId: { type: String },
      uowId: { type: String },
      phone: { type: String }
    }],
    submittedAt: { type: Date, default: Date.now }
  },
  // Stores any feedback from the lecturer if rejected
  feedback: {
    type: String
  },

  isFinalised: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Group || mongoose.model('Group', groupSchema);