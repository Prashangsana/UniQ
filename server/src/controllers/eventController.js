const events = require('../mockData/events.json');
const societies = require('../mockData/societies.json');

/*
TEMP STORAGE (until DB exists)
*/
let savedEvents = [];

let notifications = [];


/*
GET EVENT DETAILS
*/
exports.getEventDetails = (req, res) => {

  const eventId = req.params.id;

  const event = events.find(e => e._id === eventId);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found"
    });
  }

  res.json({
    success: true,
    data: event
  });
};


/*
GET EVENTS BY SOCIETY
*/
exports.getSocietyEvents = (req, res) => {

  const societyId = req.params.societyId;

  const society = societies.find(s => s._id === societyId);

  if (!society) {
    return res.status(404).json({
      success: false,
      message: "Society not found"
    });
  }

  const societyEvents = events.filter(e => e.society === societyId);

  res.json({
    success: true,
    data: societyEvents
  });
};


/*
ADD EVENT
*/
exports.addEventToMyEvents = (req, res) => {

  const userId = "mock-user-001";
  const eventId = req.params.id;

  const eventExists = events.find(e => e._id === eventId);

  if (!eventExists) {
    return res.status(404).json({
      success: false,
      message: "Event not found"
    });
  }

  const exists = savedEvents.find(
    e => e.user === userId && e.event === eventId
  );

  if (exists) {
    return res.json({
      success: true,
      message: "Event already added"
    });
  }

  savedEvents.push({
    user: userId,
    event: eventId
  });

  res.json({
    success: true,
    message: "Event added"
  });

};


/*
REMOVE EVENT
*/
exports.removeEventFromMyEvents = (req, res) => {

  const userId = "mock-user-001";
  const eventId = req.params.id;

  savedEvents = savedEvents.filter(
    e => !(e.user === userId && e.event === eventId)
  );

  res.json({
    success: true,
    message: "Event removed"
  });

};


/*
GET MY EVENTS
*/
exports.getMyEvents = (req, res) => {

  const userId = "mock-user-001";

  const userEvents = savedEvents.filter(e => e.user === userId);

  res.json({
    success: true,
    data: userEvents
  });

};

exports.getNotifications = (req, res) => {

  const userId = "mock-user-001";

  const userNotifications = notifications.filter(
    n => n.user === userId
  );

  res.json({
    success: true,
    data: userNotifications
  });

};