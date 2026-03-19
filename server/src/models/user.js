// src/models/User.js
const mongoose = require('mongoose');
//core logging fields
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstName: { type: String }, // Added as requested
  lastName: { type: String },  // Added as requested
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, 
  role: { type: String, enum: ['student', 'lecturer'], default: 'student' },
  
  // OAuth Fields
  authProvider: { type: String, default: 'local' },
  providerId: { type: String },
  photo: { type: String }, // Adding photo URL from Google
  
  username: { type: String, unique: true, sparse: true },
  course: { type: String, default: '' },
  group: { type: String, default: '' },
  bio: { type: String, maxlength: 160 },
  aboutMe: { type: String }, 
  modules: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  profileImage: { type: String },
  
  // Tracking
  lastLogin: { type: Date, default: Date.now } // Track last login
}, { timestamps: true }); // timestamps automatically adds createdAt and updatedAt

module.exports = mongoose.models.User || mongoose.model('User', userSchema);