const Group = require('../models/Group');
const GroupProject = require('../models/GroupProject');
const Module = require('../models/Module');
const User = require('../models/User');

/**
 * @desc    Create a new group for a module
 * @route   POST /api/groups
 * @access  Private (Requires JWT)
 */
exports.createGroup = async (req, res) => {
  try {
    const { name, moduleId, domain } = req.body;
    const userId = req.user._id || req.user.id; // Extracted from JWT auth middleware

    const project = await GroupProject.findOne({ moduleId: moduleId });
    if (!project) {
      return res.status(400).json({ 
        success: false, 
        message: 'No active group project found for this module.' 
      });
    }

    // Use the maxMembers defined by the lecturer in the GroupProject
    const allowedMaxMembers = project.maxMembers;

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
      maxMembers: allowedMaxMembers,
      leader: userId,
      members: [userId] // Add creator to members array
    });

    res.status(201).json({ success: true, data: newGroup });
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

// GET /api/modules/open
exports.getOpenModules = async (req, res) => {
  try {
    // This finds all modules that have a GroupProject created by a lecturer
    const projects = await GroupProject.find({ isOpen: true }).select('moduleId');
    const moduleIds = projects.map(p => p.moduleId);
    
    const modules = await Module.find({ _id: { $in: moduleIds } });
    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/groups/my
exports.getMyAllGroups = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const myGroups = await Group.find({ members: userId });
    res.status(200).json({ success: true, data: myGroups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/modules/:moduleId/my-group
exports.getMyGroup = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user.id;

    // Find the group in this module where the current student is a member
    const myGroup = await Group.findOne({ 
      moduleId: moduleId, 
      members: userId 
    }).populate('members', 'name email skills bio');

    // If no group found, returning success:true with null data is expected by the frontend
    res.status(200).json({ success: true, data: myGroup || null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching your group' });
  }
};

// GET /api/modules/:moduleId/available-students
exports.getAvailableStudents = async (req, res) => {
  try {
    const { moduleId } = req.params;

    // 1. Get IDs of all students already in a group for this module
    const groups = await Group.find({ moduleId }).select('members');
    const studentIdsInGroups = groups.flatMap(g => g.members);

    // 2. Find students who are NOT in that list
    const availableStudents = await User.find({
      role: 'student',
      _id: { 
        $nin: studentIdsInGroups, 
        $ne: req.user._id
      }
    }).select('name email skills bio');

    res.status(200).json({ success: true, count: availableStudents.length, data: availableStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching students' });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    // /api/groups/:groupId/leave, use req.params.groupId
    const group = await Group.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Identify the user leaving (using normalized ID from auth middleware)
    const userId = (req.user._id || req.user.id).toString();

    group.members = group.members.filter(m => m.toString() !== userId);

    if (group.members.length === 0) {
      await Group.findByIdAndDelete(req.params.groupId);
      return res.status(200).json({ 
        success: true, 
        message: 'You were the last member. The group has been disbanded.' 
      });
    }

    if (group.leader.toString() === userId) {
      group.leader = group.members[0];
    }

    await group.save();
    res.status(200).json({ success: true, message: 'You left the group successfully.' });
  } catch (error) {
    console.error("Leave Group Error:", error);
    res.status(500).json({ success: false, message: 'Server Error: Could not leave group.' });
  }
};