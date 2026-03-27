const Society = require('../models/Society');
const Event = require('../models/Event');
const SavedEvent = require('../models/SavedEvent');
const User = require('../models/User');
const mongoose = require('mongoose');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const resolveSocietyByIdentifier = async (identifier) => {
  const raw = String(identifier || '').trim();
  if (!raw || raw === 'undefined' || raw === 'null') return null;

  if (mongoose.Types.ObjectId.isValid(raw)) {
    return Society.findById(raw);
  }

  const normalized = raw.toLowerCase();
  const fromSlug = normalized.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  const shortExact = new RegExp(`^${escapeRegex(normalized)}$`, 'i');
  const shortSlugExact = new RegExp(`^${escapeRegex(fromSlug)}$`, 'i');

  return Society.findOne({
    $or: [
      { shortName: shortExact },
      { shortName: shortSlugExact },
      { name: shortExact },
      { name: shortSlugExact }
    ]
  });
};

/**
 * GET ALL SOCIETIES
 * Used for: Sidebar, Society Discovery
 */
exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find();
    res.status(200).json({
      success: true,
      data: societies
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error Fetching Societies: " + error.message 
    });
  }
};

/**
 * GET SOCIETY PROFILE
 * Returns society details along with their events
 */
exports.getSocietyProfile = async (req, res) => {
  try {
    const society = await resolveSocietyByIdentifier(req.params.id);
    
    if (!society) {
      return res.status(404).json({ success: false, message: "Society Not Found" });
    }

    // Get events for this society, sorted by most recent
    const events = await Event.find({ society: society._id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: {
        society,
        events
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error Fetching Society Profile: " + error.message 
    });
  }
};

/**
 * GET LEADER'S SOCIETIES
 */
exports.getLeaderSocieties = async (req, res) => {
  try {
    const leaderId = (req.user?._id || req.user?.id)?.toString();
    const leaderQuery = mongoose.Types.ObjectId.isValid(leaderId)
      ? { $in: [leaderId, new mongoose.Types.ObjectId(leaderId)] }
      : leaderId;

    const societies = await Society.find({ leader: leaderQuery });
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

/**
 * CREATE SOCIETY (Admin only)
 */
exports.createSociety = async (req, res) => {
  try {
    const { name, shortName, description, logo, leaderId } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only admins can create societies"
      });
    }

    // Validate required fields
    if (!name || !shortName || !description || !leaderId) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Check if leader exists
    const leader = await User.findById(leaderId);
    if (!leader) {
      return res.status(404).json({ success: false, message: "Assigned leader not found" });
    }

    const society = await Society.create({
      _id: shortName,
      name,
      shortName,
      description,
      logo: logo || '',
      leader: leaderId
    });

    res.status(201).json({
      success: true,
      data: society,
      message: "Society created successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating society: " + error.message
    });
  }
};

/**
 * UPDATE SOCIETY (Admin or assigned Leader)
 */
exports.updateSociety = async (req, res) => {
  try {
    const societyId = req.params.id;
    const society = await Society.findById(societyId);

    if (!society) {
      return res.status(404).json({ success: false, message: "Society Not Found" });
    }

    // Authorization check
    const isAdmin = req.user.role === 'admin';
    const isLeader = society.leader && society.leader.toString() === req.user.id;

    if (!isAdmin && !isLeader) {
      return res.status(403).json({
        success: false,
        message: "Only admins or society leaders can update societies"
      });
    }

    const updatedSociety = await Society.findByIdAndUpdate(
      societyId,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedSociety,
      message: "Society updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating society: " + error.message
    });
  }
};

/**
 * DELETE SOCIETY (Admin only)
 * Performs cascading delete of associated events
 */
exports.deleteSociety = async (req, res) => {
  try {
    const societyId = req.params.id;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete societies"
      });
    }

    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ success: false, message: "Society Not Found" });
    }

    // Cascade delete: Remove all events and saved references
    await Event.deleteMany({ society: societyId });
    await SavedEvent.deleteMany({ society: societyId });
    await Society.findByIdAndDelete(societyId);

    res.status(200).json({
      success: true,
      message: "Society and all associated data deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting society: " + error.message
    });
  }
};

/**
 * GET ALL USERS BY ROLE (Admin only)
 */
exports.getUsersByRole = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password');
    
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * ASSIGN LEADER TO SOCIETY (Admin only)
 */
exports.assignLeader = async (req, res) => {
  try {
    const { leaderId } = req.body;
    const societyId = req.params.id;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Only admins can assign leaders" });
    }

    const leader = await User.findById(leaderId);
    if (!leader) {
      return res.status(404).json({ success: false, message: "Leader not found" });
    }

    const updatedSociety = await Society.findByIdAndUpdate(
      societyId,
      { leader: leaderId },
      { new: true }
    );

    if (!updatedSociety) {
      return res.status(404).json({ success: false, message: "Society not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedSociety,
      message: "Leader assigned successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error assigning leader" });
  }
};
