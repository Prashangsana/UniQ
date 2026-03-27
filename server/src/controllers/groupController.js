const Group = require('../models/Group');
const GroupProject = require('../models/GroupProject');
const Module = require('../models/Module');
const User = require('../models/User');

exports.createGroup = async (req, res) => {
  try {
    const { name, moduleId, domain } = req.body;
    const userId = req.user._id || req.user.id;

    const project = await GroupProject.findOne({ moduleId: moduleId });
    if (!project) {
      return res.status(400).json({ 
        success: false, 
        message: 'No active group project found for this module.' 
      });
    }

    const allowedMaxMembers = project.maxMembers;

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

    const nameExists = await Group.findOne({ moduleId, name });
    if (nameExists) {
      return res.status(400).json({
        success: false,
        message: 'A group with this name already exists in this module.'
      });
    }

    const newGroup = await Group.create({
      name,
      moduleId,
      domain,
      maxMembers: allowedMaxMembers,
      leader: userId,
      members: [userId]
    });

    res.status(201).json({ success: true, data: newGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getModuleGroups = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const groups = await Group.find({ moduleId })
      .populate('members', 'name email') 
      .select('name domain members maxMembers isFinalised leader img deadlines finalisedCode');

    const formattedGroups = groups.map(group => ({
      _id: group._id,
      name: group.name,
      domain: group.domain,
      memberCount: group.members.length,
      maxMembers: group.maxMembers,
      isFinalised: group.isFinalised,
      leader: group.leader,
      members: group.members,
      img: group.img,
      deadlines: group.deadlines
    }));

    res.status(200).json({ success: true, count: formattedGroups.length, data: formattedGroups });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate('leader', 'name email role')
      .populate('members', 'name email skills bio student role'); 

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.status(200).json({ success: true, data: group });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getOpenModules = async (req, res) => {
  try {
    const projects = await GroupProject.find({ isOpen: true }).select('moduleId');
    const moduleIds = projects.map(p => p.moduleId);
    
    const modules = await Module.find({ _id: { $in: moduleIds } });
    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyAllGroups = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const myGroups = await Group.find({ members: userId });
    res.status(200).json({ success: true, data: myGroups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyGroup = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user.id;

    const myGroup = await Group.findOne({ 
      moduleId: moduleId, 
      members: userId 
    }).populate('members', 'name email skills bio');

    res.status(200).json({ success: true, data: myGroup || null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching your group' });
  }
};

exports.getAvailableStudents = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const currentUserId = req.user._id || req.user.id;

    const groups = await Group.find({ moduleId }).select('members').lean();
    const studentIdsInGroups = groups.reduce((acc, group) => {
      return acc.concat(group.members.map(m => m.toString()));
    }, []);

    console.log("Searching for module:", moduleId);
    console.log("Students already in groups:", studentIdsInGroups);

    const availableStudents = await User.find({
      role: { $regex: /^student$/i },
      _id: { 
        $nin: studentIdsInGroups, 
        $ne: currentUserId
      }
    }).select('name email skills bio photo');

    console.log(`Found ${availableStudents.length} available students for module ${moduleId}`);

    res.status(200).json({ success: true, count: availableStudents.length, data: availableStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching students' });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

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

exports.updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { img, name } = req.body;
    const userId = (req.user._id || req.user.id).toString();

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (group.leader.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: Only the group leader can update group details.' 
      });
    }

    group.img = img;
    if (name) group.name = name;

    await group.save();

    res.status(200).json({ 
      success: true, 
      message: 'Group updated successfully', 
      data: group 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getAllMyDeadlines = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    const groups = await Group.find({ members: userId }).select('name deadlines');
    
    const allDeadlines = groups.flatMap(g => 
      (g.deadlines || []).map(d => ({ 
        ...d.toObject(), 
        groupName: g.name,
        groupId: g._id 
      }))
    );

    res.status(200).json({ success: true, data: allDeadlines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDeadlines = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { deadlines } = req.body; 
    const userId = (req.user._id || req.user.id).toString();

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: "Group not found" });

    if (group.leader.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Only leaders can edit deadlines" });
    }

    group.deadlines = deadlines;
    await group.save();

    res.status(200).json({ success: true, data: group.deadlines });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating deadlines" });
  }
};