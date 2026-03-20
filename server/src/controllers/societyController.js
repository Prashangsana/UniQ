const societies = require('../mockData/societies.json');
const events = require('../mockData/events.json');
const Society = require('../models/Society');
const Event = require('../models/Event');

/* ================= GET ALL SOCIETIES (Student) ================= */
exports.getAllSocieties = async (req, res) => {
  try {
    const dbSocieties = await Society.find();
    if (!dbSocieties || dbSocieties.length === 0) {
      return res.status(200).json({
        success: true,
        count: societies.length,
        data: societies
      });
    }
    res.status(200).json({
      success: true,
      count: dbSocieties.length,
      data: dbSocieties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching societies" });
  }
};

/* ================= GET SOCIETY PROFILE (Student) ================= */
exports.getSocietyProfile = async (req, res) => {
  try {
    const societyId = req.params.id;
    let society = await Society.findById(societyId);
    
    if (!society) {
      society = societies.find(s => s._id === societyId);
    }

    if (!society) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }

    // Filter events belonging to this society
    let societyEvents = await Event.find({ society: societyId }).sort({ createdAt: -1 });
    
    if (!societyEvents || societyEvents.length === 0) {
      societyEvents = events
        .filter(event => event.society === societyId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json({
      success: true,
      data: {
        society,
        events: societyEvents
      }
    });
  } catch (error) {
    // Fallback for mock IDs
    const society = societies.find(s => s._id === req.params.id);
    if (society) {
      const societyEvents = events.filter(e => e.society === req.params.id);
      return res.status(200).json({ success: true, data: { society, events: societyEvents } });
    }
    res.status(500).json({ success: false, message: "Error fetching society profile" });
  }
};

/* ================= LEADER CRUD (Your Part) ================= */
exports.createSociety = async (req, res) => {
  try {
    const society = await Society.create({ ...req.body, leader: req.user.id });
    res.status(201).json({ success: true, data: society });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeaderSocieties = async (req, res) => {
  try {
    const societies = await Society.find({ leader: req.user.id });
    res.status(200).json({ success: true, data: societies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSociety = async (req, res) => {
  try {
    const society = await Society.findOneAndUpdate(
      { _id: req.params.id, leader: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!society) return res.status(404).json({ success: false, message: "Society not found or unauthorized" });
    res.status(200).json({ success: true, data: society });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
