const GroupInvite = require('../models/GroupInvite');
const Group = require('../models/Group');

// POST /api/groups/:groupId/invite
// Allow group members to invite another student
exports.inviteUser = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { invitedUserId, message } = req.body;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    // Rule: Only existing members can send invites
    if (!group.members.includes(userId)) {
      return res.status(403).json({ success: false, message: 'Only group members can send invites' });
    }

    // Rule: Group cannot exceed maxMembers
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ success: false, message: 'Group is already full' });
    }

    // Rule: User cannot be invited if they are already in a group for this module
    const existingGroup = await Group.findOne({ moduleId: group.moduleId, members: invitedUserId });
    if (existingGroup) {
      return res.status(400).json({ success: false, message: 'User is already in a group for this module' });
    }

    // Prevent duplicate pending invites to the same person for the same group
    const existingInvite = await GroupInvite.findOne({ group: groupId, invitedUser: invitedUserId, status: 'pending' });
    if (existingInvite) {
      return res.status(400).json({ success: false, message: 'An invite is already pending for this user' });
    }

    const newInvite = await GroupInvite.create({
      group: groupId,
      invitedUser: invitedUserId,
      message: message || "You have been invited to join our group!"
    });

    res.status(201).json({ success: true, data: newInvite });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// GET /api/invites/my
// Return all pending invites for the logged-in user
exports.getMyInvites = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch invites and populate group details so the UI can display group names/domains
    const myInvites = await GroupInvite.find({ invitedUser: userId, status: 'pending' })
      .populate('group', 'name domain members maxMembers');

    res.status(200).json({ success: true, count: myInvites.length, data: myInvites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// POST /api/invites/:inviteId/accept
// Allow a student to accept an invite
exports.acceptInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const userId = req.user.id;

    const invite = await GroupInvite.findById(inviteId);
    if (!invite || invite.status !== 'pending') {
      return res.status(404).json({ success: false, message: 'Valid pending invite not found' });
    }

    // Ensure the person accepting is the person who was invited
    if (invite.invitedUser.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to accept this invite' });
    }

    const group = await Group.findById(invite.group);
    
    // Safety check: Has the group filled up since the invite was sent?
    if (group.members.length >= group.maxMembers) {
      invite.status = 'rejected'; // Auto-reject the invite since it's no longer valid
      await invite.save();
      return res.status(400).json({ success: false, message: 'Sorry, this group is now full' });
    }

    // Safety check: Did the user join another group in the meantime?
    const existingGroup = await Group.findOne({ moduleId: group.moduleId, members: userId });
    if (existingGroup) {
      return res.status(400).json({ success: false, message: 'You are already in a group for this module' });
    }

    // All checks passed! Add user to group and mark invite accepted
    group.members.push(userId);
    await group.save();

    invite.status = 'accepted';
    await invite.save();

    res.status(200).json({ success: true, message: 'Successfully joined the group!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// POST /api/invites/:inviteId/reject
// Reject an invite
exports.rejectInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const userId = req.user.id;

    const invite = await GroupInvite.findById(inviteId);
    if (!invite || invite.status !== 'pending') {
      return res.status(404).json({ success: false, message: 'Valid pending invite not found' });
    }

    if (invite.invitedUser.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to reject this invite' });
    }

    invite.status = 'rejected';
    await invite.save();

    res.status(200).json({ success: true, message: 'Invite rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// POST /api/groups/:groupId/leave
// Allow a member to leave a group
exports.leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    // Rule: Cannot leave if the group is finalized (Stage 4 prep)
    if (group.isFinalised) {
      return res.status(400).json({ success: false, message: 'Cannot leave a finalized group' });
    }

    // Rule: Group leader cannot leave unless they are the only member
    if (group.leader.toString() === userId) {
      if (group.members.length > 1) {
        return res.status(400).json({ 
          success: false, 
          message: 'Leader cannot leave while there are other members. Please transfer leadership first.' 
        });
      } else {
        // If the leader is the only member, leaving means the group is empty. 
        // We delete the group to clean up the database.
        await Group.findByIdAndDelete(groupId);
        return res.status(200).json({ success: true, message: 'You left, and the empty group was deleted.' });
      }
    }

    // Remove the user from the members array
    group.members = group.members.filter(memberId => memberId.toString() !== userId);
    await group.save();

    res.status(200).json({ success: true, message: 'Successfully left the group' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};