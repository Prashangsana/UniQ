const mongoose = require('mongoose');

// core logging fields + your profile fields
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, 
  role: { type: String, enum: ['student', 'lecturer'], default: 'student' },
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
  
  // Tracking
  lastLogin: { type: Date, default: Date.now } 
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);