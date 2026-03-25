const GroupProject = require('../models/GroupProject');
const Group = require('../models/Group');
const Module = require('../models/Module'); // Need to import the Admin's model

// GET /api/lecturer/my-modules
exports.getMyModules = async (req, res) => {
  try {
    // Find modules where this user is EITHER a leader OR in the team
    const authorizedModules = await Module.find({
      $or: [
        { moduleLeaders: req.user.id },
        { moduleTeam: req.user.id }
      ]
    }).select('_id name'); // We only need the ID and Name for the dropdown

    res.status(200).json({ success: true, data: authorizedModules });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error fetching modules' });
  }
};

// POST /api/modules/:moduleId/group-project (LECTURER ONLY)
exports.createGroupProject = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { minMembers, maxMembers, deadline, allowedPrefixes } = req.body; // Changed to allowedPrefixes

    // Check if a project already exists for this module
    const existingProject = await GroupProject.findOne({ moduleId });
    if (existingProject) {
      return res.status(400).json({ success: false, message: 'A group project is already open for this module.' });
    }

    const newProject = await GroupProject.create({
      moduleId,
      minMembers,
      maxMembers,
      deadline,
      allowedPrefixes: allowedPrefixes || ["SE", "CS"], // Save the array of prefixes
      isOpen: true,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error creating group project' });
  }
};

// POST /api/groups/:groupId/submit-finalisation (STUDENT LEADER ONLY)
exports.submitFinalisation = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { formData, selectedPrefix } = req.body; // Extract selectedPrefix from frontend

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    // Verify the person submitting is the group leader
    if (group.leader.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the group leader can submit for finalisation.' });
    }

    // Lock the group, save form data, and save their chosen prefix
    group.status = 'pending_review';
    group.finalisationForm = formData;
    group.prefix = selectedPrefix || "GRP"; 
    await group.save();

    res.status(200).json({ success: true, message: 'Group submitted for lecturer review!', data: group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error submitting finalisation' });
  }
};

// POST /api/groups/:groupId/review (LECTURER ONLY)
exports.reviewGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { action, feedback } = req.body; // action: 'approve' or 'reject'

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (action === 'approve') {
      // COUNTING LOGIC: Count only finalised groups in THIS module with THIS SPECIFIC prefix
      const count = await Group.countDocuments({ 
        moduleId: group.moduleId, 
        isFinalised: true,
        prefix: group.prefix // Important: Only count SEs if this is an SE, etc.
      });
      
      group.status = 'finalised';
      group.isFinalised = true;
      group.finalisedCode = `${group.prefix}-${count + 1}`; // e.g., SE-3
      group.feedback = "Approved";
    } else {
      // Send it back to the students to fix
      group.status = 'open';
      group.isFinalised = false;
      group.feedback = feedback || "Rejected. Please update your members and resubmit.";
    }

    await group.save();
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error reviewing group' });
  }
};

// GET /api/lecturer/module-groups
exports.getLecturerGroups = async (req, res) => {
  try {
    // 1. Get modules the lecturer is assigned to
    const myModules = await Module.find({
      $or: [{ moduleLeaders: req.user.id }, { moduleTeam: req.user.id }]
    }).select('_id');
    const moduleIds = myModules.map(m => m._id);

    // 2. Fetch all groups for those modules
    const groups = await Group.find({ moduleId: { $in: moduleIds } })
      .populate('members', 'name student email');

    // 3. Split into pending vs finalised for the UI
    const pending = groups.filter(g => g.status === 'pending_review');
    const finalised = groups.filter(g => g.status === 'finalised');

    res.status(200).json({
      success: true,
      data: { pending, finalised }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error fetching groups' });
  }
};