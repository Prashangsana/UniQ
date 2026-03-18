// src/models/User.js
const mongoose = require('mongoose');

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
  
  // Profile fields (for your teammates)
  skills: [String],
  bio: String,
  
  // Tracking
  lastLogin: { type: Date, default: Date.now } // Track last login
}, { timestamps: true }); // timestamps automatically adds createdAt and updatedAt

module.exports = mongoose.model('User', userSchema);