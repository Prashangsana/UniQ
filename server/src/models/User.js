// src/models/User.js
const mongoose = require('mongoose');

// core logging fields + your profile fields
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstName: { type: String }, // Added as requested
  lastName: { type: String },  // Added as requested
  email: { type: String, required: true, unique: true },
  
  password: { type: String, required: false },
  role: { type: String, enum: ['student', 'lecturer', 'admin', 'society_leader'], default: 'student' },
  authProvider: { type: String, default: 'local' },
  providerId: { type: String },
  photo: { type: String }, 
  
  // --- YOUR PROFILE FIELDS (Don't lose these!) ---
  username: { type: String, unique: true, sparse: true },
  course: { type: String, default: '' },
  group: { type: String, default: '' },
  bio: { type: String, maxlength: 160 },
  aboutMe: { type: String }, 
  modules: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  profileImage: { type: String },

  education: { type: String, default: '' }, 
  department: { type: String, default: '' }, 
  expertise: { type: [String], default: [] },

  socials: {
    instagram: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  
  // Tracking
  lastLogin: { type: Date, default: Date.now } 
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
