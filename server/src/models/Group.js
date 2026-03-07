const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Group name is required'],
    trim: true
  },
  moduleId: { 
    // Using String to match your frontend mock data (e.g., '5COSC021')
    // If you have a Module collection, change this to: type: mongoose.Schema.Types.ObjectId, ref: 'Module'
    type: String, 
    required: [true, 'Module ID is required'] 
  },
  domain: { 
    type: String, 
    required: [true, 'Project domain is required'] 
  },
  members: [{ 
    // Array of ObjectIds referencing the User model
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  leader: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  maxMembers: { 
    type: Number, 
    required: [true, 'Maximum number of members is required'],
    min: [1, 'Group must have at least 1 member capacity']
  },
  isFinalised: { 
    type: Boolean, 
    default: false // Groups are open by default until a lecturer finalises them
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Group', groupSchema);