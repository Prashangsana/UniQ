const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Using string IDs to match mock data (e.g., 'rotaract-club')
  name: { type: String, required: true },
  shortName: { type: String },
  description: { type: String },
  logo: { type: String },
  leader: { type: String }, // Placeholder or reference to User
  followersCount: { type: Number, default: 0 },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Society', societySchema);
