const Event = require("../models/Event");
<<<<<<<<< Temporary merge branch 1

/*
TEMP STORAGE (until DB exists)
*/
let savedEvents = [];
let notifications = [];


/* ================= MAIN EVENT ================= */

exports.getMainEvent = async (req, res) => {

  try {

    const event = await Event
      .find()
      .sort({ date: 1 })
      .limit(1);

    /* fallback to mock data if DB empty */
    if (!event || event.length === 0) {

      const sorted = [...events].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      return res.json({
        success: true,
        data: sorted[0]
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

    /* fallback if DB empty */
    if (!latest || latest.length === 0) {

      const sorted = [...events]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

      return res.json({
        success: true,
        data: sorted
      });
    }

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

    /* fallback if DB empty */
    if (!topEvents || topEvents.length === 0) {

      const sorted = [...events]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6);

      return res.json({
        success: true,
        data: sorted
      });
    }

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


/*
GET NOTIFICATIONS
*/
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
=========
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
    console.log("\n=== CREATE EVENT ===");
    console.log("User ID:", req.user?.id);
    console.log("User Email:", req.user?.email);
    console.log("Request Body:", JSON.stringify(req.body, null, 2));

    const { 
      title, 
      description, 
      date, 
      time, 
      venue, 
      place, 
      adminLink, 
      registerLink,
      instagramLink,
      tickets, 
      status, 
      bannerImage, 
      society 
    } = req.body;

    // Validate required fields
    if (!title || !date || !time || !venue || !society) {
      console.log("✗ Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, date, time, venue, society"
      });
    }

    // Verify society exists
    const societyExists = await Society.findById(society);
    if (!societyExists) {
      console.log("✗ Society not found:", society);
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }

    console.log("✓ Society found:", societyExists.name);

    const event = new Event({
      title,
      description,
      date,
      time,
      venue: venue || place,
      place: place || venue,
      adminLink,
      registerLink,
      instagramLink,
      tickets,
      status: status || 'Active',
      bannerImage,
      society
    });

    const savedEvent = await event.save();
    console.log("✓ Event saved:", savedEvent._id);

    // Notify followers
    try {
      exports.notifyFollowersOfNewEvent(society, societyExists.name, savedEvent._id);
      console.log("✓ Followers notified");
    } catch (notifyErr) {
      console.log("! Notification error:", notifyErr.message);
    }

    console.log("================\n");
    res.status(201).json({
      success: true,
      data: savedEvent,
      message: "Event created successfully"
    });
  } catch (error) {
    console.log("✗ Create event error:", error);
    console.log("================\n");
    res.status(500).json({
      success: false,
      message: "Error creating event: " + error.message
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
    
    // Get event details before deletion for notification cleanup
    const event = await Event.findById(eventId);
    
    await Event.findByIdAndDelete(eventId);

    // Also remove from SavedEvents
    await SavedEvent.deleteMany({ event: eventId });

    // Remove notifications related to this event
    if (event) {
      await exports.removeEventNotifications(eventId);
    }

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
    
    // Run cleanup before returning notifications
    await exports.cleanupOrphanedNotifications();
    
    // Also do immediate cleanup for specific societies if they have no active events
    await exports.immediateCleanupForSpecificSocieties();
    
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

// Immediate cleanup for BIZLINK and ROTARACT notifications
exports.immediateCleanupForSpecificSocieties = async () => {
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
    console.error("Error in immediate cleanup:", error);
  }
};


/*
CLEANUP NOTIFICATIONS (Admin only)
*/
exports.cleanupNotifications = async (req, res) => {
  try {
    await exports.cleanupOrphanedNotifications();
    
    res.json({
      success: true,
      message: "Orphaned notifications cleaned up successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cleaning up notifications"
    });
  }
};