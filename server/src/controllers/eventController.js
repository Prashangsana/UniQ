const events = require('../mockData/events.json');
const societies = require('../mockData/societies.json');
const Event = require("../models/Event");
const SavedEvent = require("../models/SavedEvent");

/* 
TEMP STORAGE (until DB exists) 
*/
let notifications = [];

/* ================= MAIN EVENT (Student) ================= */
exports.getMainEvent = async (req, res) => {
  try {
    const event = await Event.find().sort({ date: 1 }).limit(1);

    if (!event || event.length === 0) {
      const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
      return res.json({ success: true, data: sorted[0] });
    }
    res.json({ success: true, data: event[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching main event" });
  }
};

/* ================= LATEST EVENTS (Student) ================= */
exports.getLatestEvents = async (req, res) => {
  try {
    const latest = await Event.find().sort({ createdAt: -1 }).limit(6);

    if (!latest || latest.length === 0) {
      const sorted = [...events]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);
      return res.json({ success: true, data: sorted });
    }
    res.json({ success: true, data: latest });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching latest events" });
  }
};

/* ================= TOP EVENTS THIS WEEK (Student) ================= */
exports.getTopEvents = async (req, res) => {
  try {
    const topEvents = await Event.find().sort({ date: 1 }).limit(6);

    if (!topEvents || topEvents.length === 0) {
      const sorted = [...events]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6);
      return res.json({ success: true, data: sorted });
    }
    res.json({ success: true, data: topEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching top events" });
  }
};

/* ================= EVENT DETAILS (Student) ================= */
exports.getEventDetails = async (req, res) => {
  try {
    const eventId = req.params.id;
    let event = await Event.findById(eventId);

    if (!event) {
      event = events.find(e => e._id === eventId);
    }

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    // If ID is not a valid ObjectId, search in mock data
    const event = events.find(e => e._id === req.params.id);
    if (event) return res.json({ success: true, data: event });
    res.status(500).json({ success: false, message: "Error fetching event details" });
  }
};

/* ================= SOCIETY EVENTS (Student) ================= */
exports.getSocietyEvents = async (req, res) => {
  try {
    const societyId = req.params.societyId;
    const societyEvents = await Event.find({ society: societyId });

    if (!societyEvents || societyEvents.length === 0) {
      const mockSocietyEvents = events.filter(e => e.society === societyId);
      return res.json({ success: true, data: mockSocietyEvents });
    }
    res.json({ success: true, data: societyEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching society events" });
  }
};

/* ================= MY EVENTS (Student) ================= */
exports.addEventToMyEvents = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : "mock-user-001";
    const eventId = req.params.id;

    const exists = await SavedEvent.findOne({ user: userId, event: eventId });
    if (exists) {
      return res.json({ success: true, message: "Event already added" });
    }

    await SavedEvent.create({ user: userId, event: eventId });
    res.json({ success: true, message: "Event added" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding event" });
  }
};

exports.removeEventFromMyEvents = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : "mock-user-001";
    const eventId = req.params.id;

    await SavedEvent.findOneAndDelete({ user: userId, event: eventId });
    res.json({ success: true, message: "Event removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing event" });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : "mock-user-001";
    const userEvents = await SavedEvent.find({ user: userId });
    res.json({ success: true, data: userEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching my events" });
  }
};

/* ================= NOTIFICATIONS (Student) ================= */
exports.getNotifications = (req, res) => {
  const userId = req.user ? req.user.id : "mock-user-001";
  const userNotifications = notifications.filter(n => n.user === userId);
  res.json({ success: true, data: userNotifications });
};

/* ================= LEADER CRUD (Your Part) ================= */
exports.createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body, leader: req.user.id };
    const event = await Event.create(eventData);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeaderEvents = async (req, res) => {
  try {
    const events = await Event.find({ leader: req.user.id });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, leader: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ success: false, message: "Event not found or unauthorized" });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, leader: req.user.id });
    if (!event) return res.status(404).json({ success: false, message: "Event not found or unauthorized" });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
