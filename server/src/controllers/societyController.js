const societies = require('../mockData/societies.json');
const events = require('../mockData/events.json');


/*
-----------------------------------------
GET ALL SOCIETIES
API: GET /api/societies
-----------------------------------------
Used for:
- "Your Societies" sidebar
*/
exports.getAllSocieties = (req, res) => {

  try {

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
exports.getSocietyProfile = (req, res) => {

  try {

    const societyId = req.params.id;

    const society = societies.find(
      s => s._id === societyId
    );

    if (!society) {

      return res.status(404).json({
        success: false,
        message: "Society not found"
      });

    }

    // Filter events belonging to this society
    const societyEvents = events
      .filter(event => event.society === societyId)
      .sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );


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