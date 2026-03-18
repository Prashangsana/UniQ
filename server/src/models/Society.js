const mongoose = require("mongoose");

const SocietySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  leader: {
    type: String,
    default: "Admin User",
  },
  followersCount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model("Society", SocietySchema);
