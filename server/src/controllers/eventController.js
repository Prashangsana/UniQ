const Event = require("../models/Event");
const SavedEvent = require("../models/SavedEvent");
const Society = require("../models/Society");
const mongoose = require("mongoose");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const resolveSocietyByIdentifier = async (identifier) => {
  const raw = String(identifier || '').trim();
  if (!raw || raw === 'undefined' || raw === 'null') return null;

  if (mongoose.Types.ObjectId.isValid(raw)) {
    return Society.findById(raw);
  }

  const normalized = raw.toLowerCase();
  const fromSlug = normalized.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  const exact = new RegExp(`^${escapeRegex(normalized)}$`, 'i');
  const slugExact = new RegExp(`^${escapeRegex(fromSlug)}$`, 'i');

  return Society.findOne({
    $or: [
      { shortName: exact },
      { shortName: slugExact },
      { name: exact },
      { name: slugExact }
    ]
  });
};

// GET MAIN EVENT (Single latest happening event)
exports.getMainEvent = async (req, res) => {
  try {
    const mainEvent = await Event.find({ status: { $ne: 'Draft' } })
      .populate('society', 'name logo')
      .sort({ date: 1 })
      .limit(1);
    res.json({ success: true, data: mainEvent[0] || null });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching main event" });
  }
};

// GET ALL EVENTS (Renamed from getMainEvent to maintain consistency)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('society', 'name logo').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching events" });
  }
};

// GET LATEST EVENTS (Last published 6 events)
exports.getLatestEvents = async (req, res) => {
  try {
    const latest = await Event.find({ status: { $ne: 'Draft' } })
      .populate('society', 'name logo')
      .sort({ createdAt: -1 })
      .limit(6);
    res.json({ success: true, data: latest });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching latest events" });
  }
};

// GET TOP EVENTS (Latest happening 6 events)
exports.getTopEvents = async (req, res) => {
  try {
    const topEvents = await Event.find({ status: { $ne: 'Draft' } })
      .populate('society', 'name logo')
      .sort({ date: 1 })
      .limit(6);
    res.json({ success: true, data: topEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching top events" });
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
    const leaderId = String(req.params.leaderId || '').trim();
    const leaderQuery = mongoose.Types.ObjectId.isValid(leaderId)
      ? { $in: [leaderId, new mongoose.Types.ObjectId(leaderId)] }
      : leaderId;

    const societies = await Society.find({ leader: leaderQuery });
    const societyIds = societies.map(s => s._id);
    
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
    const societyIdentifier = req.body.society;
    if (!societyIdentifier) {
      return res.status(400).json({ success: false, message: "Society ID is required" });
    }

    const society = await resolveSocietyByIdentifier(societyIdentifier);
    if (!society) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }

    const isAdmin = req.user.role === 'admin';
    const isLeader = society.leader && society.leader.toString() === req.user.id;

    if (!isAdmin && !isLeader) {
      return res.status(403).json({ success: false, message: "Unauthorized to create events for this society" });
    }

    const eventData = { ...req.body, society: society._id };
    const event = await Event.create(eventData);
    const populatedEvent = await Event.findById(event._id).populate('society', 'name logo');
    
    res.status(201).json({ success: true, data: populatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Error creating event" });
  }
};

// UPDATE EVENT
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const society = await resolveSocietyByIdentifier(event.society);
    const isAdmin = req.user.role === 'admin';
    const isLeader = society && society.leader && society.leader.toString() === req.user.id;

    if (!isAdmin && !isLeader) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this event" });
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

    const society = await resolveSocietyByIdentifier(event.society);
    const isAdmin = req.user.role === 'admin';
    const isLeader = society && society.leader && society.leader.toString() === req.user.id;

    if (!isAdmin && !isLeader) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);
    await SavedEvent.deleteMany({ event: req.params.id });
    
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting event" });
  }
};

// SAVED EVENTS LOGIC
exports.addEventToMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id || req.body.eventId;

    const existing = await SavedEvent.findOne({ user: userId, event: eventId });
    if (existing) {
      return res.status(400).json({ success: true, message: "Event already saved" });
    }

    const savedEvent = await SavedEvent.create({ user: userId, event: eventId });
    res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving event" });
  }
};

exports.removeEventFromMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;

    const result = await SavedEvent.findOneAndDelete({ user: userId, event: eventId });
    if (!result) {
      return res.status(404).json({ success: false, message: "Saved event not found" });
    }
    res.status(200).json({ success: true, message: "Event removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing event" });
  }
};

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

// NOTIFICATIONS
exports.getNotifications = async (req, res) => {
  try {
    // Placeholder logic for future notification model
    res.status(200).json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching notifications" });
  }
};

exports.cleanupNotifications = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Notifications cleaned up" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error cleaning up notifications" });
  }
};
