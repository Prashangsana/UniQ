const mockUser = require('../data/mockUser.json');

const { groupsDb } = require('./mockGroupController');

// Temporary in-memory DB for invites
let invitesDb = [
  // Let's add a fake invite so you can see it in your UI immediately!
  {
    _id: "inv_123",
    group: "test_group_123",
    groupId: "CS-105-Alpha", // Helper for UI
    domain: "Web Development", // Helper for UI
    members: 3, // Helper for UI
    invitedUser: mockUser._id,
    message: "Hey! Join our React project.",
    status: 'pending',
    createdAt: new Date()
  }
];

// POST /api/groups/:groupId/invite
exports.inviteUser = async (req, res) => {
  const { groupId } = req.params;
  const { invitedUserId, message } = req.body;
  
  const newInvite = {
    _id: "inv_" + Date.now(),
    group: groupId,
    invitedUser: invitedUserId,
    message: message || "You are invited to our group",
    status: 'pending',
    createdAt: new Date()
  };

  invitesDb.push(newInvite);
  res.status(201).json({ success: true, data: newInvite });
};

// GET /api/invites/my
exports.getMyInvites = async (req, res) => {
  // Find invites where the logged-in user is the invitedUser
  const myInvites = invitesDb.filter(i => i.invitedUser === req.user.id && i.status === 'pending');
  res.status(200).json({ success: true, data: myInvites });
};

// POST /api/invites/:inviteId/accept
exports.acceptInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const invite = invitesDb.find(i => i._id === inviteId);
    
    if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });
    if (invite.status !== 'pending') return res.status(400).json({ success: false, message: 'Invite is no longer pending' });

    let group = groupsDb.find(g => g._id === invite.group);

    // --- FIX: Actually create the group in the database! ---
    if (!group && invite._id === "inv_123") {
      group = {
        _id: "test_group_123",
        name: "CS-105-Alpha",
        // CHANGE THE LINE BELOW to match a Module ID on your Dashboard!
        moduleId: "5COSC019C ", 
        domain: "Web Development",
        maxMembers: 5,
        leader: { _id: "fake_leader", name: "System Admin" },
        members: [], 
        isFinalised: false
      };
      groupsDb.push(group); // Push the new group into our mock database
    }
    // --------------------------------------------------------

    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    // Validation Checks
    if (group.members.length >= group.maxMembers) {
      invite.status = 'rejected';
      return res.status(400).json({ success: false, message: 'Sorry, this group is now full' });
    }

    const existingGroup = groupsDb.find(g => 
      g.moduleId === group.moduleId && 
      g.members.some(m => (m._id || m) === mockUser._id)
    );

    if (existingGroup) {
      return res.status(400).json({ success: false, message: 'You are already in a group for this module' });
    }

    // Add user to the group!
    group.members.push(mockUser);
    invite.status = 'accepted';
    
    res.status(200).json({ success: true, message: 'Successfully joined the group!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/invites/:inviteId/reject
exports.rejectInvite = async (req, res) => {
  const { inviteId } = req.params;
  const invite = invitesDb.find(i => i._id === inviteId);
  
  if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });
  
  invite.status = 'rejected';
  res.status(200).json({ success: true, message: 'Invite rejected.' });
};

// POST /api/groups/:groupId/leave
exports.leaveGroup = async (req, res) => {
  const { groupId } = req.params;
  const userId = mockUser._id; // Using our mock user ID

  // 1. Find the group in our mock database
  const groupIndex = groupsDb.findIndex(g => g._id === groupId);
  if (groupIndex === -1) {
    return res.status(404).json({ success: false, message: 'Group not found' });
  }

  const group = groupsDb[groupIndex];

  // 2. Logic: Leader can only leave if they are the last person
  const isLeader = (group.leader._id === userId || group.leader === userId);
  
  if (isLeader) {
    if (group.members.length > 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Leader cannot leave while there are other members. Please transfer leadership first.' 
      });
    } else {
      // User is the leader AND the only member. Delete the entire group!
      groupsDb.splice(groupIndex, 1);
      return res.status(200).json({ success: true, message: 'You left, and the empty group was deleted.' });
    }
  }

  // 3. Logic: Standard member leaving
  // Filter out the user from the members array
  group.members = group.members.filter(m => (m._id || m) !== userId);

  res.status(200).json({ success: true, message: 'Successfully left the group.' });
};