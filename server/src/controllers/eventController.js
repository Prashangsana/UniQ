const Event = require("../models/Event");
const SavedEvent = require("../models/SavedEvent");
const Society = require("../models/Society");
const Notification = require("../models/Notification");
const Follow = require("../models/Follow");
const mongoose = require("mongoose");

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

    // Handle mock IDs for the Society Leader dashboard
    const mockIds = ["main-hackathon-2026", "rec-event-1", "rec-event-2", "old-event-1", "top-0", "top-1", "top-2"];
    
    if (mockIds.includes(eventId)) {
      // Return a specific mock event "ESCAPED" for the top events to match the user's screenshot
      const escapedMock = {
        _id: eventId,
        title: "ESCAPED",
        description: "A thrilling escape room experience.",
        date: new Date("2026-03-08"),
        time: "09:00 AM",
        venue: "IIT Auditorium",
        adminLink: "https://docs.google.com/forms/...",
        status: "Draft",
        tickets: [
          { name: "Standard", price: "1000" },
          { name: "VIP", price: "2500" }
        ],
        bannerImage: ""
      };
      
      return res.json({
        success: true,
        data: escapedMock
      });
    }

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