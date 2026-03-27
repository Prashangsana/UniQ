const { groupsDb } = require('./mockGroupController');

let invitesDb = [
  {
    _id: "inv_123",
    group: "test_group_123",
    groupId: "CS-105-Alpha",
    domain: "Web Development",
    members: 3,
    invitedUser: "user_id_student_1",
    message: "Hey! Join our React project.",
    status: 'pending',
    createdAt: new Date()
  }
];

exports.inviteUser = async (req, res) => {
  const { groupId } = req.params;
  const { invitedUserId, message } = req.body;

  const group = groupsDb.find(g => g._id === groupId);
  if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

  if (group && group.status !== 'open') {
    return res.status(400).json({ success: false, message: 'Group is locked for finalisation.' });
  }
  
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

exports.getMyInvites = async (req, res) => {
  const myInvites = invitesDb.filter(i => i.invitedUser === req.user.id && i.status === 'pending');
  res.status(200).json({ success: true, data: myInvites });
};

exports.acceptInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const invite = invitesDb.find(i => i._id === inviteId);
    
    if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });
    if (invite.status !== 'pending') return res.status(400).json({ success: false, message: 'Invite is no longer pending' });

    let group = groupsDb.find(g => g._id === invite.group);

    if (!group && invite._id === "inv_123") {
      group = {
        _id: "test_group_123",
        name: "CS-105-Alpha",
        moduleId: "5COSC019C", 
        domain: "Web Development",
        maxMembers: 5,
        leader: { _id: "fake_leader", name: "System Admin" },
        members: [], 
        isFinalised: false,
        status: 'open'
      };
      groupsDb.push(group);
    }

    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (group.members.length >= group.maxMembers) {
      invite.status = 'rejected';
      return res.status(400).json({ success: false, message: 'Sorry, this group is now full' });
    }

    const existingGroup = groupsDb.find(g => 
      g.moduleId === group.moduleId && 
      g.members.some(m => (m._id || m) === req.user.id)
    );

    if (existingGroup) {
      return res.status(400).json({ success: false, message: 'You are already in a group for this module' });
    }

    group.members.push(req.user);
    invite.status = 'accepted';
    
    res.status(200).json({ success: true, message: 'Successfully joined the group!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectInvite = async (req, res) => {
  const { inviteId } = req.params;
  const invite = invitesDb.find(i => i._id === inviteId);
  
  if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });
  
  invite.status = 'rejected';
  res.status(200).json({ success: true, message: 'Invite rejected.' });
};

exports.leaveGroup = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  const groupIndex = groupsDb.findIndex(g => g._id === groupId);
  if (groupIndex === -1) {
    return res.status(404).json({ success: false, message: 'Group not found' });
  }

  const group = groupsDb[groupIndex];

  if (group.status !== 'open') {
    return res.status(400).json({ 
      success: false, 
      message: 'Group is locked. You cannot leave a group that is pending review or finalised.' 
    });
  }

  const isLeader = (group.leader._id === userId || group.leader === userId);
  
  if (isLeader) {
    if (group.members.length > 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Leader cannot leave while there are other members. Please transfer leadership first.' 
      });
    } else {
      groupsDb.splice(groupIndex, 1);
      return res.status(200).json({ success: true, message: 'You left, and the empty group was deleted.' });
    }
  }

  group.members = group.members.filter(m => (m._id || m) !== userId);

  res.status(200).json({ success: true, message: 'Successfully left the group.' });
};