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

  place: {
    type: String,
    required: true
  },

  price: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);