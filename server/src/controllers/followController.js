const Follow = require("../models/Follow");
const Society = require("../models/Society");

// FOLLOW SOCIETY
exports.followSociety = async (req, res) => {
  try {
    const userId = req.user.id;
    const societyId = req.params.id;

    const already = await Follow.findOne({ user: userId, society: societyId });

    if (already) {
      return res.json({
        success: true,
        message: "Already following"
      });
    }

    const follow = new Follow({ user: userId, society: societyId });
    await follow.save();

    // Increment followers count
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
    const societyId = req.params.id;

    const deletedFollow = await Follow.findOneAndDelete({ user: userId, society: societyId });

    if (deletedFollow) {
      // Decrement followers count
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


exports.checkFollowStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const societyId = req.params.id;

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