const GroupProject = require('../models/GroupProject');
const Group = require('../models/Group');
const Module = require('../models/Module');

exports.getMyModules = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const lecturerId = req.user._id || req.user.id;

    console.log("Lecturer ID from Request:", lecturerId.toString());
    console.log("Searching modules for Lecturer ID:", lecturerId);

    const authorizedModules = await Module.find({
      $or: [
        { moduleLeaders: lecturerId },
        { moduleTeam: lecturerId }
      ]
    }).select('_id name');

    console.log("Modules found in DB:", authorizedModules);

    res.status(200).json({ 
      success: true, 
      count: authorizedModules.length, 
      data: authorizedModules 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error fetching modules' });
  }
};

exports.getLecturerGroups = async (req, res) => {
  try {
    const lecturerId = req.user.id;

    const myModules = await Module.find({
      $or: [{ moduleLeaders: lecturerId }, { moduleTeam: lecturerId }]
    }).select('_id');

    const myModuleIds = myModules.map(m => m._id);
    
    const relevantGroups = await Group.find({ moduleId: { $in: myModuleIds } })
      .populate('members', 'name email iitId uowId') 
      .lean();

    const pendingGroup = relevantGroups.find(g => g.status === 'pending_review');
    console.log("Pending Group Form Data:", pendingGroup?.finalisationForm);

    console.log("Sample Group Form Data:", relevantGroups[0]?.finalisationForm);

    res.status(200).json({ 
      success: true, 
      data: {
        pending: relevantGroups.filter(g => g.status === 'pending_review'),
        finalised: relevantGroups.filter(g => g.status === 'finalised')
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createGroupProject = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { minMembers, maxMembers, deadline, allowedPrefixes } = req.body;

    const existingProject = await GroupProject.findOne({ moduleId });
    if (existingProject) {
      return res.status(400).json({ success: false, message: 'A group project is already open for this module.' });
    }

    const isAuthorized = await Module.findOne({
      _id: moduleId,
      $or: [{ moduleLeaders: req.user.id }, { moduleTeam: req.user.id }]
    });

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'You are not authorized to manage this module.' });
    }

    const project = await GroupProject.findOneAndUpdate(
      { moduleId },
      { 
        minMembers, 
        maxMembers, 
        deadline, 
        allowedPrefixes, 
        isOpen: true, 
        createdBy: req.user.id 
      },
      { upsert: true, returnDocument: 'after' }
    );

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error creating group project' });
  }
};

exports.submitFinalisation = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { formData, selectedPrefix } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (group.leader.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the group leader can submit for finalisation.' });
    }

    group.finalisationForm = {
      tutorialGroup: formData.tutorialGroup,
      memberExtraInfo: formData.memberExtraInfo,
      submittedAt: Date.now()
    };

    group.status = 'pending_review';
    group.prefix = selectedPrefix || "GRP"; 
    group.isFinalised = false;

    group.markModified('finalisationForm');

    await group.save();

    res.status(200).json({ success: true, message: 'Group submitted for lecturer review!', data: group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error submitting finalisation' });
  }
};

exports.reviewGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { action, feedback } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (action === 'approve') {
      const count = await Group.countDocuments({ 
        moduleId: group.moduleId, 
        status: 'finalised',
        prefix: group.prefix
      });
      
      group.status = 'finalised';
      group.isFinalised = true;
      group.finalisedCode = `${group.prefix}-${count + 1}`;
      group.feedback = "Approved";
    } else {
      group.status = 'open';
      group.isFinalised = false;
      group.feedback = feedback || "Rejected. Please update your members and resubmit.";
    }

    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate('members', 'name email iitId uowId')
      .select('+finalisationForm +prefix');

    res.status(200).json({ success: true, data: updatedGroup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error reviewing group' });
  }
};

exports.getGroupProjects = async (req, res) => {
  res.status(200).json({ success: true, data: groupProjectsDb });
};