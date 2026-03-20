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
  },

  description: {
    type: String,
    required: true
  },

  instagramLink: {
    type: String
  },

  registerLink: {
    type: String
  },

  time: {
    type: String,
    required: true
  },

  venue: {
    type: String,
    required: true
  },

  adminLink: {
    type: String
  },

  registerLink: {
    type: String
  },

  status: {
    type: String,
    enum: ['Active', 'Draft', 'Featured', 'Past'],
    default: 'Active'
  },

  tickets: [{
    name: String,
    price: String
  }]

}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);