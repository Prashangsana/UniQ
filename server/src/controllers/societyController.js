const Society = require("../models/Society");
const Event = require("../models/Event");

/*
GET LEADER'S SOCIETIES
API: GET /api/societies/leader/all
*/
exports.getLeaderSocieties = async (req, res) => {
  try {
    // For now, return all societies as placeholder or filter by leader if we have that info
    // In a real app, this would be: await Society.find({ leader: req.user.id })
    const societies = await Society.find();

    res.status(200).json({
      success: true,
      data: societies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leader societies"
    });
  }
};


/*
GET ALL SOCIETIES
API: GET /api/societies
*/
exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find();

    res.status(200).json({
      success: true,
      count: societies.length,
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
    const societyId = req.params.id;
    const society = await Society.findById(societyId);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }

    // Filter events belonging to this society, latest first
    const societyEvents = await Event.find({ society: societyId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        society,
        events: societyEvents
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching society profile"
    });
  }
};