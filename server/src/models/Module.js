const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  // We use String for _id so it matches your current IDs like '5COSC019C'
  _id: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  // Array of User ObjectIds who can manage this module
  moduleLeaders: [{ 
    type: String, 
    ref: 'User' 
  }],
  moduleTeam: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { timestamps: true });

module.exports = mongoose.models.Module || mongoose.model('Module', moduleSchema);