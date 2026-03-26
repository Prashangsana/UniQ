const Event = require("../models/Event");
const SavedEvent = require("../models/SavedEvent");
const Society = require("../models/Society");
const mongoose = require("mongoose");

// GET ALL EVENTS
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('society', 'name logo').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching events" });
  }
};

// GET EVENT DETAILS
exports.getEventDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('society', 'name logo');
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching event details" });
  }
};

// GET SOCIETY EVENTS
exports.getSocietyEvents = async (req, res) => {
  try {
    const events = await Event.find({ society: req.params.societyId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching society events" });
  }
};

// GET LEADER EVENTS
exports.getLeaderEvents = async (req, res) => {
  try {
    // Get all societies led by this user
    const societies = await Society.find({ leader: req.params.leaderId });
    const societyIds = societies.map(s => s._id);
    
    // Get events for those societies
    const events = await Event.find({ society: { $in: societyIds } })
      .populate('society', 'name logo')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching leader events" });
  }
};

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    const societyId = req.body.society;
    if (!societyId) {
      return res.status(400).json({ success: false, message: "Society ID is required" });
    }

    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }

    const isAdmin = req.user.role === 'admin';
    const isLeader = society.leader && society.leader.toString() === req.user.id;

    if (!isAdmin && !isLeader) {
      return res.status(403).json({ success: false, message: "Only an admin or the society leader can create events" });
    }

    const eventData = {
      ...req.body,
      society: societyId
    };

    const event = await Event.create(eventData);
    const populatedEvent = await Event.findById(event._id).populate('society', 'name logo');
    
    res.status(201).json({ success: true, data: populatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating event" });
  }
};

// UPDATE EVENT
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const society = await Society.findById(event.society);
    const isAdmin = req.user.role === 'admin';
    const isLeader = society && society.leader && society.leader.toString() === req.user.id;

    if (!isAdmin && !isLeader) {
      return res.status(403).json({ success: false, message: "Only an admin or the society leader can update this event" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('society', 'name logo');
    
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating event" });
  }
};

// DELETE EVENT
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const society = await Society.findById(event.society);
    const isAdmin = req.user.role === 'admin';
    const isLeader = society && society.leader && society.leader.toString() === req.user.id;

    if (!isAdmin && !isLeader) {
      return res.status(403).json({ success: false, message: "Only an admin or the society leader can delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);
    
    // Remove from saved events
    await SavedEvent.deleteMany({ event: req.params.id });
    
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting event" });
  }
};

// ADD EVENT TO MY EVENTS
exports.addEventToMyEvents = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    // Check if already saved
    const existing = await SavedEvent.findOne({ user: userId, event: eventId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Event already saved" });
    }

    const savedEvent = await SavedEvent.create({ user: userId, event: eventId });
    res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving event" });
  }
};

// REMOVE EVENT FROM MY EVENTS
exports.removeEventFromMyEvents = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const result = await SavedEvent.findOneAndDelete({ user: userId, event: eventId });
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Saved event not found" });
    }
    
    res.status(200).json({ success: true, message: "Event removed from saved events" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing saved event" });
  }
};

// GET MY EVENTS
exports.getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const savedEvents = await SavedEvent.find({ user: userId })
      .populate('event')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: savedEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching saved events" });
  }
};

// GET NOTIFICATIONS (placeholder)
exports.getNotifications = async (req, res) => {
  try {
    // Placeholder implementation
    res.status(200).json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching notifications" });
  }
};

// CLEANUP NOTIFICATIONS (placeholder)
exports.cleanupNotifications = async (req, res) => {
  try {
    // Placeholder implementation
    res.status(200).json({ success: true, message: "Notifications cleaned up" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error cleaning up notifications" });
  }
};
