const mongoose = require("mongoose");

const FollowSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true
  }
}, { timestamps: true });

// Prevent duplicate follows
FollowSchema.index({ user: 1, society: 1 }, { unique: true });

module.exports = mongoose.model("Follow", FollowSchema);
