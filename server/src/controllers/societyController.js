const Society = require('../models/Society');
const Event = require('../models/Event');

exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find();
    
    res.status(200).json({
      success: true,
      count: societies.length,
      data: societies
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error Fetching Societies: " + error.message });
  }
};

exports.getSocietyProfile = async (req, res) => {
  try {
    const societyId = req.params.id;
    const society = await Society.findById(societyId);
    
    if (!society) {
      return res.status(404).json({ success: false, message: "Society Not Found" });
    }

    const societyEvents = await Event.find({ society: societyId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        society,
        events: societyEvents
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error Fetching Society Profile: " + error.message });
  }
};

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

exports.getLeaderSocieties = async (req, res) => {
  try {
    const leaderSocieties = await Society.find({ leader: req.user.id });
    res.status(200).json({ success: true, data: leaderSocieties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSociety = async (req, res) => {
  try {
    const society = await Society.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    
    if (!society) {
      return res.status(404).json({ success: false, message: "Society Not Found" });
    }
    
    res.status(200).json({ success: true, data: society });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSociety = async (req, res) => {
  try {
    const society = await Society.findByIdAndDelete(req.params.id);
    
    if (!society) {
      return res.status(404).json({ success: false, message: "Society Not Found" });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};