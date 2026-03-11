const mockUser = require('../data/mockUser.json');

// Temporary in-memory DB for requests
let requestsDb = [];

exports.createRequest = async (req, res) => {
  const { groupId } = req.params;
  
  const newRequest = {
    _id: "req_" + Date.now(),
    group: groupId,
    requester: mockUser, // Simulating a populated user
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