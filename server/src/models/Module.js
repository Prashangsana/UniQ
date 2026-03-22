const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    required: true
  },
  name: { 
    type: String, 
    required: true 
  },
  moduleLeaders: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  moduleTeam: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);