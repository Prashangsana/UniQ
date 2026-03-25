const Group = require('../models/Group');

/**
 * @desc    Create a new group for a module
 * @route   POST /api/groups
 * @access  Private (Requires JWT)
 */
exports.createGroup = async (req, res) => {
  try {
    const { name, moduleId, domain, maxMembers } = req.body;
    const userId = req.user.id; // Extracted from JWT auth middleware

    // Constraint Check: Prevent a user from being in more than one group per module.
    // We check if a group exists for this module where the members array includes this userId.
    const existingGroup = await Group.findOne({ 
      moduleId: moduleId, 
      members: userId 
    });

    if (existingGroup) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already a member of a group for this module.' 
      });
    }

    // Constraint Check: Ensure group name is unique within the module (optional but recommended)
    const nameExists = await Group.findOne({ moduleId, name });
    if (nameExists) {
      return res.status(400).json({
        success: false,
        message: 'A group with this name already exists in this module.'
      });
    }

    // Create the group. Creator automatically becomes the leader and first member.
    const newGroup = await Group.create({
      name,
      moduleId,
      domain,
      maxMembers,
      leader: userId,
      members: [userId] // Add creator to members array
    });

    res.status(201).json({ success: true, data: newGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get all groups for the current user
 * @route   GET /api/groups/my-groups
 * @access  Private
 */
exports.getMyAllGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const groups = await Group.find({ members: userId })
      .populate('moduleId', 'name');
    
    // Add a 'joined' property for frontend compatibility
    const formatted = groups.map(g => ({
      ...g.toObject(),
      joined: true
    }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get all groups for a given module
 * @route   GET /api/modules/:moduleId/groups
 * @access  Private
 */
exports.getModuleGroups = async (req, res) => {
  try {
    const { moduleId } = req.params;

    // Fetch groups for the specific module
    const groups = await Group.find({ moduleId })
      .select('name domain members maxMembers isFinalised leader');

    // Format the response to explicitly include member count for the frontend
    const formattedGroups = groups.map(group => ({
      _id: group._id,
      name: group.name,
      domain: group.domain,
      memberCount: group.members.length,
      maxMembers: group.maxMembers,
      isFinalised: group.isFinalised,
      leader: group.leader
    }));

    res.status(200).json({ success: true, count: formattedGroups.length, data: formattedGroups });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get full group details with populated members
 * @route   GET /api/groups/:groupId
 * @access  Private
 */
exports.getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Find the group and populate the references.
    // Populate replaces the User ObjectIds with actual User documents (filtering fields to send).
    const group = await Group.findById(groupId)
      .populate('leader', 'name email role') // Assuming User model has name, email, role
      .populate('members', 'name email skills bio student role'); 

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.status(200).json({ success: true, data: group });
  } catch (error) {
    // Check if error is due to an invalid Mongoose ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};