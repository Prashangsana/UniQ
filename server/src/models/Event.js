const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true
  },

  bannerImage: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);