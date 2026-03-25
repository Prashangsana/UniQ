const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  shortName: { type: String },
  description: { type: String },
  logo: { type: String },
  leader: { type: String },
  followersCount: { type: Number, default: 0 },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Society', societySchema);