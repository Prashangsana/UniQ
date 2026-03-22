const Society = require("../models/Society");
const Event = require("../models/Event");
const SavedEvent = require("../models/SavedEvent");

/*
GET LEADER'S SOCIETIES
API: GET /api/societies/leader/all
*/
exports.getLeaderSocieties = async (req, res) => {
  try {
    // For now, return all societies as we're in development
    // In production, you'd filter by req.user.id
    const societies = await Society.find();

    res.status(200).json({
      success: true,
      data: societies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leader's societies"
    });
  }
};


/*
-----------------------------------------
GET ALL SOCIETIES
API: GET /api/societies
-----------------------------------------
Used for:
- "Your Societies" sidebar
*/
exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find();

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
exports.getSocietyProfile = async (req, res) => {
  try {
    const societyId = req.params.id;
    const society = await Society.findById(societyId);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }

    // Filter events belonging to this society, latest first
    const societyEvents = await Event.find({ society: societyId })
      .sort({ createdAt: -1 });

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

function requireSocietyLeader(req, res) {
  if (!req.user || req.user.role !== 'society_leader') {
    res.status(403).json({
      success: false,
      message: 'Only society leaders can manage clubs and societies'
    });
    return false;
  }
  return true;
}

/*
POST CREATE SOCIETY / CLUB
API: POST /api/societies
*/
exports.createSociety = async (req, res) => {
  try {
    // Allow any authenticated user to create societies for now
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to create societies'
      });
    }

    const { name, shortName, description, logo } = req.body || {};
    const n = typeof name === 'string' ? name.trim() : '';
    const sn = typeof shortName === 'string' ? shortName.trim() : '';
    const desc = typeof description === 'string' ? description.trim() : '';

    if (!n || !sn || !desc) {
      return res.status(400).json({
        success: false,
        message: 'Name, short name, and description are required'
      });
    }

    const logoUrl = typeof logo === 'string' ? logo.trim() : '';

    const society = await Society.create({
      name: n,
      shortName: sn,
      description: desc,
      logo: logoUrl || undefined,
      leader: req.user.name || 'Society Creator'
    });

    res.status(201).json({
      success: true,
      data: society
    });
  } catch (error) {
    console.error('createSociety:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Could not create society'
    });
  }
};

/*
PUT UPDATE SOCIETY / CLUB
API: PUT /api/societies/:id
*/
exports.updateSociety = async (req, res) => {
  try {
    // Allow any authenticated user to update societies for now
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to update societies'
      });
    }

    const societyId = req.params.id;
    const { name, shortName, description, logo } = req.body || {};

    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }

    if (typeof name === 'string' && name.trim()) society.name = name.trim();
    if (typeof shortName === 'string' && shortName.trim()) society.shortName = shortName.trim();
    if (typeof description === 'string' && description.trim()) society.description = description.trim();
    if (typeof logo === 'string') society.logo = logo.trim();

    await society.save();

    res.status(200).json({
      success: true,
      data: society
    });
  } catch (error) {
    console.error('updateSociety:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Could not update society'
    });
  }
};

/*
DELETE SOCIETY / CLUB
API: DELETE /api/societies/:id
*/
exports.deleteSociety = async (req, res) => {
  try {
    // Allow any authenticated user to delete societies for now
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to delete societies'
      });
    }

    const societyId = req.params.id;
    const society = await Society.findById(societyId);
    
    if (!society) {
      return res.status(404).json({
        success: false,
        message: 'Society not found'
      });
    }

    // Find and delete all events associated with this society
    const eventsToDelete = await Event.find({ society: societyId });
    console.log(`Found ${eventsToDelete.length} events to delete for society ${society.name}`);

    // Get all event IDs for cleanup
    const eventIds = eventsToDelete.map(event => event._id);

    // Delete all events for this society
    const deleteEventsResult = await Event.deleteMany({ society: societyId });
    console.log(`Deleted ${deleteEventsResult.deletedCount} events for society ${society.name}`);

    // Remove all saved events references for the deleted events
    if (eventIds.length > 0) {
      const deleteSavedEventsResult = await SavedEvent.deleteMany({ 
        event: { $in: eventIds } 
      });
      console.log(`Removed ${deleteSavedEventsResult.deletedCount} saved event entries for society ${society.name}`);
    }

    // Delete the society
    await Society.findByIdAndDelete(societyId);
    console.log(`Deleted society: ${society.name}`);

    res.status(200).json({
      success: true,
      message: `Society deleted successfully. Removed ${deleteEventsResult.deletedCount} events and cleaned up all related data.`
    });
  } catch (error) {
    console.error('deleteSociety:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Could not delete society'
    });
  }
};