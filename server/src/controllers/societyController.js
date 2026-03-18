const Society = require("../models/Society");
const Event = require("../models/Event");

/*
-----------------------------------------
GET ALL SOCIETIES
API: GET /api/societies
-----------------------------------------
Used for:
- "Your Societies" sidebar
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
-----------------------------------------
GET SOCIETY PROFILE
API: GET /api/societies/:id
-----------------------------------------
Returns:
- society details
- events under that society
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

    // Filter events belonging to this society
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