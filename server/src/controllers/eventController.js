const Event = require("../models/Event");
const SavedEvent = require("../models/SavedEvent");
const Society = require("../models/Society");

/* ================= MAIN EVENT ================= */

exports.getMainEvent = async (req, res) => {
  try {
    const event = await Event
      .find()
      .sort({ date: 1 })
      .limit(1);

    if (!event || event.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No events found"
      });
    }

    res.json({
      success: true,
      data: event[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching main event"
    });
  }
};


/* ================= LATEST EVENTS ================= */

exports.getLatestEvents = async (req, res) => {
  try {
    const latest = await Event
      .find()
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: latest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching latest events"
    });
  }
};


/* ================= TOP EVENTS THIS WEEK ================= */

exports.getTopEvents = async (req, res) => {
  try {
    const topEvents = await Event
      .find()
      .sort({ date: 1 })
      .limit(6);

    res.json({
      success: true,
      data: topEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching top events"
    });
  }
};


/*
GET EVENT DETAILS
*/
exports.getEventDetails = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching event details"
    });
  }
};


/*
GET EVENTS BY SOCIETY
*/
exports.getSocietyEvents = async (req, res) => {
  try {
    const societyId = req.params.societyId;
    const society = await Society.findById(societyId);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }

    const societyEvents = await Event.find({ society: societyId });

    res.json({
      success: true,
      data: societyEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching society events"
    });
  }
};


/*
ADD EVENT
*/
exports.addEventToMyEvents = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user is populated by authMiddleware
    const eventId = req.params.id;

    const eventExists = await Event.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    const exists = await SavedEvent.findOne({ user: userId, event: eventId });
    if (exists) {
      return res.json({
        success: true,
        message: "Event already added"
      });
    }

    const savedEvent = new SavedEvent({ user: userId, event: eventId });
    await savedEvent.save();

    res.json({
      success: true,
      message: "Event added"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding event"
    });
  }
};


/*
REMOVE EVENT
*/
exports.removeEventFromMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;

    await SavedEvent.findOneAndDelete({ user: userId, event: eventId });

    res.json({
      success: true,
      message: "Event removed"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing event"
    });
  }
};


/*
GET MY EVENTS
*/
exports.getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEvents = await SavedEvent.find({ user: userId }).populate('event');

    res.json({
      success: true,
      data: userEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching my events"
    });
  }
};


/*
GET NOTIFICATIONS
*/
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    // For now, returning empty array as notifications logic is not yet implemented with DB
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications"
    });
  }
};