const mockUser = require('../data/mockUser.json');

const { groupsDb } = require('./mockGroupController');

// Temporary in-memory DB for requests
let requestsDb = [];

exports.createRequest = async (req, res) => {
  const { groupId } = req.params;
  const userId = mockUser._id; // Use mock user ID for validation
  
  // 1. Find target group
  const targetGroup = groupsDb.find(g => g._id === groupId);
  if (!targetGroup) return res.status(404).json({ success: false, message: 'Group not found' });

  // 2. VALIDATION: Check if group is already full
  if (targetGroup.members.length >= targetGroup.maxMembers) {
    return res.status(400).json({ success: false, message: 'Cannot join: This group is full.' });
  }

  // 3. VALIDATION: Check if user is already in another group for this module
  const existingGroup = groupsDb.find(g => 
    g.moduleId === targetGroup.moduleId && 
    g.members.some(m => m._id === userId)
  );

  if (existingGroup) {
    return res.status(400).json({ 
      success: false, 
      message: 'You are already in a group for this module. Leave your current group first.' 
    });
  }

  // 4. VALIDATION: Check for existing pending request
  const existingRequest = requestsDb.find(r => 
    r.group === groupId && r.requester._id === userId && r.status === 'pending'
  );

  if (existingRequest) {
    return res.status(400).json({ success: false, message: 'You already have a pending request for this group.' });
  }

  // Passed all checks! Create the request.
  const newRequest = {
    _id: "req_" + Date.now(),
    group: groupId,
    requester: mockUser, 
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

  // Simulate adding approval
  if (!request.approvals.includes(req.user.id)) {
    request.approvals.push(req.user.id);
  }

  // Simulate unanimous approval logic (assuming 1 member in mock group for now)
  request.status = 'approved'; 

  res.status(200).json({ success: true, message: 'Approved (Mock)', data: request });
};

exports.rejectRequest = async (req, res) => {
  const { requestId } = req.params;
  const request = requestsDb.find(r => r._id === requestId);
  
  if (request) request.status = 'rejected';
  
  res.status(200).json({ success: true, message: 'Rejected (Mock)' });
};