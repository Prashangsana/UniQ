const { groupsDb } = require('./mockGroupController');

let requestsDb = [];

exports.createRequest = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;
  
  const targetGroup = groupsDb.find(g => g._id === groupId);
  if (!targetGroup) return res.status(404).json({ success: false, message: 'Group not found' });

  if (targetGroup.members.length >= targetGroup.maxMembers) {
    return res.status(400).json({ success: false, message: 'Cannot join: This group is full.' });
  }

  const existingGroup = groupsDb.find(g => 
    g.moduleId === targetGroup.moduleId && 
    g.members.some(m => (m._id || m) == userId)
  );

  if (targetGroup.status !== 'open') {
    return res.status(400).json({ 
      success: false, 
      message: 'This group is no longer accepting new members as it is being finalised.' 
    });
  }

  if (existingGroup) {
    return res.status(400).json({ 
      success: false, 
      message: 'You are already in a group for this module. Leave your current group first.' 
    });
  }

  const existingRequest = requestsDb.find(r => 
    r.group === groupId && (r.requester._id || r.requester) === userId && r.status === 'pending'
  );

  if (existingRequest) {
    return res.status(400).json({ success: false, message: 'You already have a pending request for this group.' });
  }

  const newRequest = {
    _id: "req_" + Date.now(),
    group: groupId,
    requester: req.user, 
    approvals: [],
    status: 'pending',
    createdAt: new Date()
  };

  requestsDb.push(newRequest);
  res.status(201).json({ success: true, data: newRequest });
};

exports.getGroupRequests = async (req, res) => {
  const { groupId } = req.params;
  const groupRequests = requestsDb.filter(r => r.group === groupId && r.status === 'pending');
  res.status(200).json({ success: true, data: groupRequests });
};

exports.approveRequest = async (req, res) => {
  const { requestId } = req.params;
  const request = requestsDb.find(r => r._id === requestId);
  
  if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

  if (group.members.length >= group.maxMembers) {
    request.status = 'rejected';
    return res.status(400).json({ success: false, message: 'Group is now full. Request auto-rejected.' });
  }

  if (!request.approvals.includes(req.user.id)) {
    request.approvals.push(req.user.id);
  }

  request.status = 'approved'; 

  const group = groupsDb.find(g => g._id === request.group);
  if (group) {
    const isAlreadyMember = group.members.some(m => (m._id || m) === request.requester._id);
    if (!isAlreadyMember) {
      group.members.push(request.requester);
    }
  }

  res.status(200).json({ success: true, message: 'Approved (Mock)', data: request });
};

exports.rejectRequest = async (req, res) => {
  const { requestId } = req.params;
  const request = requestsDb.find(r => r._id === requestId);
  
  if (request) request.status = 'rejected';
  
  res.status(200).json({ success: true, message: 'Rejected (Mock)' });
};