const mockUser = require('../data/mockUser.json');
const { groupsDb } = require('./mockGroupController');

// Mock Database for Group Projects
let groupProjectsDb = [];

// Add this near the top with your other mock databases
const mockModulesDb = [
  { _id: '5COSC019C', name: 'Software Engineering', moduleLeaders: ['lecturer_123'], moduleTeam: [] },
  { _id: '5COSC021C', name: 'Database Systems', moduleLeaders: [], moduleTeam: ['lecturer_123'] },
  { _id: '5COSC023C', name: 'Operating Systems', moduleLeaders: ['some_other_guy'], moduleTeam: [] }, // Lecturer shouldn't see this one
];

// Add this new function
// GET /api/lecturer/my-modules
exports.getMyModules = async (req, res) => {
  // We simulate checking the logged-in user's ID
  // In our mock setup, let's assume the logged-in lecturer is 'lecturer_123'
  const lecturerId = req.user ? req.user.id : 'lecturer_123'; 

  const authorizedModules = mockModulesDb.filter(m => 
    m.moduleLeaders.includes(lecturerId) || m.moduleTeam.includes(lecturerId)
  );

  res.status(200).json({ success: true, data: authorizedModules });
};

// POST /api/modules/:moduleId/group-project
exports.createGroupProject = async (req, res) => {
  const { moduleId } = req.params;
  const { minMembers, maxMembers, deadline, allowedPrefixes } = req.body;

  const newProject = {
    _id: "proj_" + Date.now(),
    moduleId,
    minMembers,
    maxMembers,
    deadline,
    // Store an array of prefixes (e.g. ["SE", "CS", "AI"])
    allowedPrefixes: allowedPrefixes || ["SE", "CS"], 
    isOpen: true,
    createdBy: req.user.id
  };

  groupProjectsDb.push(newProject);
  res.status(201).json({ success: true, data: newProject });
};

// POST /api/groups/:groupId/submit-finalisation (STUDENT LEADER)
exports.submitFinalisation = async (req, res) => {
  const { groupId } = req.params;
  const { formData, selectedPrefix } = req.body; // Student now sends their prefix!

  const group = groupsDb.find(g => g._id === groupId);
  if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

  group.status = 'pending_review';
  group.finalisationForm = formData;
  group.prefix = selectedPrefix || "GRP"; // Save the student's choice

  res.status(200).json({ success: true, message: 'Submitted for review!', data: group });
};

// POST /api/groups/:groupId/review
exports.reviewGroup = async (req, res) => {
  const { groupId } = req.params;
  const { action, feedback } = req.body;

  const group = groupsDb.find(g => g._id === groupId);
  if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

  if (action === 'approve') {
    group.status = 'finalised';
    group.isFinalised = true;
    
    // COUNTING LOGIC: Count only finalised groups in THIS module with THIS specific prefix
    const count = groupsDb.filter(g => 
      g.isFinalised && 
      g.moduleId === group.moduleId && 
      g.prefix === group.prefix
    ).length;
    
    // Assign the new code (e.g., SE-1, CS-1)
    group.finalisedCode = `${group.prefix}-${count + 1}`;
    group.feedback = "Approved";
  } else {
    group.status = 'open'; 
    group.isFinalised = false;
    group.feedback = feedback || "Rejected. Please update your members.";
  }

  res.status(200).json({ success: true, data: group });
};

exports.groupProjectsDb = groupProjectsDb;