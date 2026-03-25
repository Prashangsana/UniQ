const mongoose = require('mongoose');

const groupProjectSchema = new mongoose.Schema({
  moduleId: { type: String, required: true, unique: true },
  minMembers: { type: Number, required: true, default: 3 },
  maxMembers: { type: Number, required: true, default: 5 },
  deadline: { type: Date, required: true },
  isOpen: { type: Boolean, default: true },
  
  // Accepts an array of prefixes (e.g., ["SE", "CS", "DS"])
  allowedPrefixes: [{ type: String, required: true }], 
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('GroupProject', groupProjectSchema);