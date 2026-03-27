const Follow = require("../models/Follow");
const Society = require("../models/Society");
const mongoose = require('mongoose');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const resolveSocietyId = async (identifier) => {
  const raw = String(identifier || '').trim();
  if (!raw || raw === 'undefined' || raw === 'null') return null;

  if (mongoose.Types.ObjectId.isValid(raw)) return raw;

  const normalized = raw.toLowerCase();
  const fromSlug = normalized.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  const shortExact = new RegExp(`^${escapeRegex(normalized)}$`, 'i');
  const shortSlugExact = new RegExp(`^${escapeRegex(fromSlug)}$`, 'i');

  const society = await Society.findOne({
    $or: [
      { shortName: shortExact },
      { shortName: shortSlugExact },
      { name: shortExact },
      { name: shortSlugExact }
    ]
  }).select('_id');

  return society?._id?.toString() || null;
};

// FOLLOW SOCIETY
exports.followSociety = async (req, res) => {
  try {
    const userId = req.user.id;
    const societyId = await resolveSocietyId(req.params.id);
    if (!societyId) return res.status(400).json({ success: false, message: "Invalid society" });

    // Check if already following
    const already = await Follow.findOne({ user: userId, society: societyId });

    if (already) {
      return res.json({
        success: true,
        message: "Already following"
      });
    }

    // Create follow record
    const follow = new Follow({ user: userId, society: societyId });
    await follow.save();

    // Increment followers count in the Society model
    await Society.findByIdAndUpdate(societyId, { $inc: { followersCount: 1 } });

    res.json({
      success: true,
      message: "Now following"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error following society"
    });
  }
};

// UNFOLLOW SOCIETY
exports.unfollowSociety = async (req, res) => {
  try {
    const userId = req.user.id;
    const societyId = await resolveSocietyId(req.params.id);
    if (!societyId) return res.status(400).json({ success: false, message: "Invalid society" });

    const deletedFollow = await Follow.findOneAndDelete({ user: userId, society: societyId });

    if (deletedFollow) {
      // Decrement followers count in the Society model
      await Society.findByIdAndUpdate(societyId, { $inc: { followersCount: -1 } });
    }

    res.json({
      success: true,
      message: "Unfollowed"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error unfollowing society"
    });
  }
};

// GET FOLLOWED SOCIETIES
exports.getFollowedSocieties = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch follows and populate society details (name, logo, etc.)
    const userFollows = await Follow.find({ user: userId }).populate('society');

    res.json({
      success: true,
      data: userFollows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching followed societies"
    });
  }
};

// CHECK FOLLOW STATUS
exports.checkFollowStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const societyId = await resolveSocietyId(req.params.id);
    if (!societyId) return res.status(400).json({ success: false, message: "Invalid society" });

    // Efficiently check if document exists
    const isFollowing = await Follow.exists({ user: userId, society: societyId });

    res.json({
      success: true,
      following: !!isFollowing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking follow status"
    });
  }
};
