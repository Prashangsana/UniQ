const JoinRequest = require('../models/JoinRequest');
const Group = require('../models/Group');

exports.createRequest = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ success: false, message: 'Group is already full' });
    }

    const existingGroup = await Group.findOne({ moduleId: group.moduleId, members: userId });
    if (existingGroup) {
      return res.status(400).json({ success: false, message: 'You are already in a group for this module' });
    }

    const existingRequest = await JoinRequest.findOne({ group: groupId, requester: userId, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'Join request already pending' });
    }

    const newRequest = await JoinRequest.create({ group: groupId, requester: userId });
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getGroupRequests = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const requests = await JoinRequest.find({ group: groupId, status: 'pending' })
      .populate('requester', 'name email skills student');

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const request = await JoinRequest.findById(requestId);
    if (!request || request.status !== 'pending') {
      return res.status(404).json({ success: false, message: 'Valid pending request not found' });
    }

    const group = await Group.findById(request.group);

    if (!group.members.some(m => m.toString() === userId)) {
      return res.status(403).json({ success: false, message: 'Only group members can approve' });
    }

    if (request.approvals.includes(userId)) {
      return res.status(400).json({ success: false, message: 'You already approved this request' });
    }

    request.approvals.push(userId);

    if (request.approvals.length === group.members.length) {
      group.members.push(request.requester);
      await group.save();

      request.status = 'approved';
    }

    await request.save();

    res.status(200).json({ 
      success: true, 
      message: request.status === 'approved' ? 'Request fully approved and user added!' : 'Approval recorded. Waiting for other members.',
      data: request 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await JoinRequest.findByIdAndUpdate(requestId, { status: 'rejected' }, { returnDocument: 'after' });
    
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    res.status(200).json({ success: true, message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};