const Society = require('../models/Society');
const Event = require('../models/Event');
const SavedEvent = require('../models/SavedEvent');
const User = require('../models/User');

/*
GET ALL SOCIETIES
API: GET /api/societies
Used for:
- "Your Societies" sidebar
*/
exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find();
    
    res.status(200).json({
      success: true,
      data: societies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching societies"
    });
  }
};

/*
GET SOCIETY PROFILE
API: GET /api/societies/:id
*/
exports.getSocietyProfile = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);
    
    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }

    // Get events for this society
    const events = await Event.find({ society: req.params.id });
    
    res.status(200).json({
      success: true,
      data: {
        society,
        events
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching society profile"
    });
  }
};

/*
GET LEADER'S SOCIETIES
API: GET /api/societies/leader/all
*/
exports.getLeaderSocieties = async (req, res) => {
  try {
    // Get societies where the user is the leader
    const societies = await Society.find({ leader: req.user.id });

    res.status(200).json({
      success: true,
      data: societies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leader's societies"
    });
  }
};

/*
CREATE SOCIETY (Admin only)
API: POST /api/societies
*/
exports.createSociety = async (req, res) => {
  try {
    const { name, shortName, description, logo, leaderId } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only admins can create societies"
      });
    }

    // Validate required fields
    if (!name || !shortName || !description || !leaderId) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Check if leader exists
    const leader = await User.findById(leaderId);
    if (!leader) {
      return res.status(404).json({
        success: false,
        message: "Leader not found"
      });
    }

    // Create society
    const society = new Society({
      name,
      shortName,
      description,
      logo: logo || '',
      leader: leaderId
    });

    await society.save();

    res.status(201).json({
      success: true,
      data: society,
      message: "Society created successfully"
    });
  } catch (error) {
    console.error("Create Society Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating society"
    });
  }
};

/*
UPDATE SOCIETY (Leader only)
API: PUT /api/societies/:id
*/
exports.updateSociety = async (req, res) => {
  try {
    const { name, shortName, description, logo } = req.body;
    const societyId = req.params.id;

    // Find the society
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }

    // Check if user is admin or the leader of this society
    const isAdmin = req.user.role === 'admin';
    const isLeader = society.leader && society.leader.toString() === req.user.id;

    if (!isAdmin && !isLeader) {
      return res.status(403).json({
        success: false,
        message: "Only admins or society leaders can update societies"
      });
    }

    // Update society
    const updatedSociety = await Society.findByIdAndUpdate(
      societyId,
      { name, shortName, description, logo },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedSociety,
      message: "Society updated successfully"
    });
  } catch (error) {
    console.error("Update Society Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating society"
    });
  }
};

/*
DELETE SOCIETY (Admin only)
API: DELETE /api/societies/:id
*/
exports.deleteSociety = async (req, res) => {
  try {
    const societyId = req.params.id;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete societies"
      });
    }

    // Find the society
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }

    // Delete all events associated with this society
    await Event.deleteMany({ society: societyId });

    // Remove society from users' saved events
    await SavedEvent.deleteMany({ society: societyId });

    // Delete the society
    await Society.findByIdAndDelete(societyId);

    res.status(200).json({
      success: true,
      message: "Society and all associated events deleted successfully"
    });
  } catch (error) {
    console.error("Delete Society Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting society"
    });
  }
};

/*
GET ALL USERS BY ROLE (Admin only)
API: GET /api/admin/users?role=student|admin|society_leader
*/
exports.getUsersByRole = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only admins can view users by role"
      });
    }

    const { role } = req.query;
    const query = role ? { role } : {};
    
    const users = await User.find(query).select('-password');
    
    res.status(200).json({ 
      success: true, 
      data: users 
    });
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server Error" 
    });
  }
};

/*
ASSIGN LEADER TO SOCIETY (Admin only)
API: PUT /api/admin/societies/:id/assign-leader
*/
exports.assignLeader = async (req, res) => {
  try {
    const { leaderId } = req.body;
    const societyId = req.params.id;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only admins can assign leaders"
      });
    }

    // Validate inputs
    if (!leaderId) {
      return res.status(400).json({
        success: false,
        message: "Leader ID is required"
      });
    }

    // Check if society exists
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }

    // Check if leader exists
    const leader = await User.findById(leaderId);
    if (!leader) {
      return res.status(404).json({
        success: false,
        message: "Leader not found"
      });
    }

    // Update society leader
    society.leader = leaderId;
    await society.save();

    res.status(200).json({
      success: true,
      data: society,
      message: "Leader assigned successfully"
    });
  } catch (error) {
    console.error("Assign Leader Error:", error);
    res.status(500).json({
      success: false,
      message: "Error assigning leader"
    });
  }
};
