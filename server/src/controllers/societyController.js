const Society = require('../models/Society');
const Event = require('../models/Event');

// GET ALL SOCIETIES
exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find();
    
    res.status(200).json({
      success: true,
      count: societies.length,
      data: societies
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching societies: " + error.message });
  }
};

// GET SOCIETY PROFILE
exports.getSocietyProfile = async (req, res) => {
  try {
    const societyId = req.params.id;
    const society = await Society.findById(societyId);
    
    if (!society) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }

    // Filter events belonging to this society
    const societyEvents = await Event.find({ society: societyId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        society,
        events: societyEvents
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching society profile: " + error.message });
  }
};

// CREATE SOCIETY
exports.createSociety = async (req, res) => {
  try {
    const leaderId = req.body.leader || req.user.id; 
    
    const society = await Society.create({ 
      ...req.body, 
      leader: leaderId 
    });
    
    res.status(201).json({ success: true, data: society });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SOCIETIES FOR A SPECIFIC LEADER
exports.getLeaderSocieties = async (req, res) => {
  try {
    const leaderSocieties = await Society.find({ leader: req.user.id });
    res.status(200).json({ success: true, data: leaderSocieties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE SOCIETY
exports.updateSociety = async (req, res) => {
  try {
    const society = await Society.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!society) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }
    
    res.status(200).json({ success: true, data: society });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE SOCIETY 
exports.deleteSociety = async (req, res) => {
  try {
    const society = await Society.findByIdAndDelete(req.params.id);
    
    if (!society) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};