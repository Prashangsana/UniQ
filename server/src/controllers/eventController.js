const Event = require("../models/Event");
const SavedEvent = require("../models/SavedEvent");
const Society = require("../models/Society");
const Notification = require("../models/Notification");
const Follow = require("../models/Follow");

/* ================= NOTIFICATIONS HELPERS ================= */

// Helper function to notify all followers of a society
exports.notifyFollowersOfNewEvent = async (societyId, societyName) => {
  try {
    const followers = await Follow.find({ society: societyId });
    const notifications = followers.map(f => ({
      user: f.user,
      message: `${societyName} has added a new event.`
    }));
    
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
};

/* ================= MAIN EVENT ================= */

exports.getMainEvent = async (req, res) => {
  try {
    const today = new Date();
    const event = await Event
      .findOne({ date: { $gte: today } })
      .sort({ date: 1 });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "No upcoming events found"
      });
    }

    res.json({
      success: true,
      data: event
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
    const today = new Date();
    const topEvents = await Event
      .find({ date: { $gte: today } })
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
GET ALL EVENTS
*/
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching all events"
    });
  }
};


/*
CREATE EVENT (Admin only)
*/
exports.createEvent = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      date, 
      time, 
      venue, 
      place, 
      adminLink, 
      tickets, 
      status, 
      bannerImage, 
      society 
    } = req.body;

    const event = new Event({
      title,
      description,
      date,
      time,
      venue: venue || place,
      place: place || venue,
      adminLink,
      tickets,
      status: status || 'Active',
      bannerImage,
      society
    });

    await event.save();

    // Notify followers
    const soc = await Society.findById(society);
    if (soc) {
      exports.notifyFollowersOfNewEvent(society, soc.name);
    }

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating event"
    });
  }
};


/*
UPDATE EVENT (Admin only)
*/
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updateData = req.body;

    // Map venue/place if only one is provided
    if (updateData.venue && !updateData.place) updateData.place = updateData.venue;
    if (updateData.place && !updateData.venue) updateData.venue = updateData.place;

    const event = await Event.findByIdAndUpdate(eventId, updateData, { new: true });

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
      message: "Error updating event"
    });
  }
};


/*
DELETE EVENT (Admin only)
*/
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    await Event.findByIdAndDelete(eventId);

    // Also remove from SavedEvents
    await SavedEvent.deleteMany({ event: eventId });

    res.json({
      success: true,
      message: "Event deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting event"
    });
  }
};


/*
GET NOTIFICATIONS
*/
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userNotifications = await Notification
      .find({ user: userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: userNotifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications"
    });
  }
};