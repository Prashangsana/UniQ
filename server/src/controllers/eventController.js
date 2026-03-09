const events = require('../mockData/events.json');
const societies = require('../mockData/societies.json');


/*
-----------------------------------------
GET EVENT DETAILS
API: GET /api/events/:id
-----------------------------------------
Returns full information about one event
*/
exports.getEventDetails = (req, res) => {

  try {

    const eventId = req.params.id;

    const event = events.find(
      e => e._id === eventId
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching event"
    });

  }

};



/*
-----------------------------------------
GET EVENTS BY SOCIETY
API: GET /api/events/society/:societyId
-----------------------------------------
Returns all events under a society
Sorted newest first
*/
exports.getSocietyEvents = (req, res) => {

  try {

    const societyId = req.params.societyId;

    const society = societies.find(
      s => s._id === societyId
    );

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }

    const societyEvents = events
      .filter(event => event.society === societyId)
      .sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

    res.status(200).json({
      success: true,
      count: societyEvents.length,
      data: societyEvents
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error fetching events"
    });

  }

};