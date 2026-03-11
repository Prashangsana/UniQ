const mockUser = require('../data/mockUser.json');

// This array acts as our temporary MongoDB
let groupsDb = [];

exports.createGroup = async (req, res) => {
  try {
    const { name, moduleId, domain, maxMembers } = req.body;
    const userId = req.user.id;

    // Constraint Check: Prevent multiple groups per module
    const existingGroup = groupsDb.find(g => 
      g.moduleId === moduleId && g.members.some(m => m._id === userId)
    );

    if (existingGroup) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already a member of a group for this module.' 
      });
    }

    // Create the group and push to our array
    const newGroup = {
      _id: "grp_" + Date.now(), // Generate a fake MongoDB _id
      name,
      moduleId,
      domain,
      maxMembers,
      leader: mockUser, 
      members: [mockUser], // Store the full mock user to simulate "populate()"
      isFinalised: false
    };

    groupsDb.push(newGroup);
    res.status(201).json({ success: true, data: newGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getModuleGroups = async (req, res) => {
  try {
    const { moduleId } = req.params;

    // Filter array by module
    const moduleGroups = groupsDb.filter(g => g.moduleId === moduleId);

    // Format response exactly how the real controller does
    const formattedGroups = moduleGroups.map(group => ({
      _id: group._id,
      name: group.name,
      domain: group.domain,
      memberCount: group.members.length,
      maxMembers: group.maxMembers,
      isFinalised: group.isFinalised,
      leader: group.leader._id
    }));

    res.status(200).json({ success: true, count: formattedGroups.length, data: formattedGroups });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Find specific group in array
    const group = groupsDb.find(g => g._id === groupId);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};