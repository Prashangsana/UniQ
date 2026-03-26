const GroupInvite = require('../models/GroupInvite');
const Group = require('../models/Group');

exports.inviteUser = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { invitedUserId, message } = req.body;
    const userId = (req.user._id || req.user.id).toString();

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (!group.members.includes(userId)) {
      return res.status(403).json({ success: false, message: 'Only group members can send invites' });
    }

    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ success: false, message: 'Group is already full' });
    }

    const alreadyInAGroup = await Group.findOne({ moduleId: group.moduleId, members: invitedUserId });
    if (alreadyInAGroup) {
      return res.status(400).json({ success: false, message: 'User is already in a group for this module' });
    }

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

exports.getMyInvites = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const myInvites = await GroupInvite.find({ invitedUser: userId, status: 'pending' })
      .populate('group', 'name domain members maxMembers moduleId');

    res.status(200).json({ success: true, count: myInvites.length, data: myInvites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.acceptInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const userId = (req.user._id || req.user.id).toString();

    const invite = await GroupInvite.findById(inviteId).populate('group');
    if (!invite || invite.status !== 'pending') {
      return res.status(404).json({ success: false, message: 'Invite no longer valid' });
    }

    if (invite.invitedUser.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to accept this invite' });
    }

    const group = await Group.findById(invite.group._id);

    const userInModuleGroup = await Group.findOne({ moduleId: group.moduleId, members: userId });
    if (userInModuleGroup) {
      return res.status(400).json({ success: false, message: 'You are already in a group for this module' });
    }
    
    if (group.members.length >= group.maxMembers) {
      invite.status = 'rejected';
      await invite.save();
      return res.status(400).json({ success: false, message: 'Sorry, this group is now full' });
    }

    await Group.findByIdAndUpdate(group._id, {
      $addToSet: { members: userId }
    });

    invite.status = 'accepted';
    await invite.save();

    res.status(200).json({ success: true, message: 'Successfully joined the group!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.rejectInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const userId = (req.user._id || req.user.id).toString();

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

exports.leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (group.isFinalised) {
      return res.status(400).json({ success: false, message: 'Cannot leave a finalized group' });
    }

    if (group.leader.toString() === userId) {
      if (group.members.length > 1) {
        return res.status(400).json({ 
          success: false, 
          message: 'Leader cannot leave while there are other members. Please transfer leadership first.' 
        });
      } else {
        await Group.findByIdAndDelete(groupId);
        return res.status(200).json({ success: true, message: 'You left, and the empty group was deleted.' });
      }
    }

    group.members = group.members.filter(memberId => memberId.toString() !== userId);
    await group.save();

    res.status(200).json({ success: true, message: 'Successfully left the group' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};