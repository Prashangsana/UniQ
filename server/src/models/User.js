const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: String, enum: ['student', 'lecturer', 'admin', 'society_leader'], default: 'student' },
  authProvider: { type: String, default: 'local' },
  providerId: { type: String },
  photo: { type: String },
  skills: [String],
  bio: String,
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);