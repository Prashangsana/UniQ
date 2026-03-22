const mongoose = require('mongoose');

const GroupProjectSchema = new mongoose.Schema({
  moduleId: { 
    type: String, // Or mongoose.Schema.Types.ObjectId if you prefer
    required: true,
    unique: true 
  },
  minMembers: { type: Number, default: 3 },
  maxMembers: { type: Number, default: 5 },
  deadline: { type: Date, required: true },
  allowedPrefixes: { type: [String], default: ["SE", "CS", "AI"] },
  isOpen: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('GroupProject', GroupProjectSchema);