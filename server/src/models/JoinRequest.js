const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema({
  group: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group', 
    required: true 
  },
  requester: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  approvals: [{ 
    // Array of User IDs who have approved this request
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, { 
  timestamps: true // Gives us createdAt automatically
});

module.exports = mongoose.model('JoinRequest', joinRequestSchema);