const mockUser = require('../data/mockUser.json');
const mockModules = require('../data/mockModules.json');
const mockLecturers = require('../data/mockLecturers.json');
const mockStudents = require('../data/mockStudents.json');
const { groupsDb, openModulesDb } = require('./mockGroupController');

// Mock Database for Group Projects
let groupProjectsDb = [];


// GET /api/lecturer/my-modules
exports.getMyModules = async (req, res) => {
  // Using user_id_lecturer_1 (Nilakshi Nonis) from your mock data
  const lecturerId = req.user ? req.user.id : 'user_id_lecturer_1'; 

  const authorizedModules = mockModules.filter(m => 
    m.moduleLeaders.includes(lecturerId) || m.moduleTeam.includes(lecturerId)
  );

  const formattedModules = authorizedModules.map(m => ({ _id: m._id, name: m.name }));
  res.status(200).json({ success: true, data: formattedModules });
};

// GET /api/lecturer/module-groups
exports.getLecturerGroups = async (req, res) => {
  const lecturerId = req.user ? req.user.id : 'user_id_lecturer_1'; 

  // 1. Get module IDs this lecturer manages
  const myModuleIds = mockModules
    .filter(m => m.moduleLeaders.includes(lecturerId) || m.moduleTeam.includes(lecturerId))
    .map(m => m._id);

  // 2. Filter groups in those modules
  const relevantGroups = groupsDb.filter(g => myModuleIds.includes(g.moduleId));

  // 3. Separate them
  const pendingGroups = relevantGroups.filter(g => g.status === 'pending_review');
  const finalisedGroups = relevantGroups.filter(g => g.status === 'finalised');

  res.status(200).json({ 
    success: true, 
    data: { pending: pendingGroups, finalised: finalisedGroups }
  });
};

// POST /api/modules/:moduleId/group-project
exports.createGroupProject = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { minMembers, maxMembers, deadline, allowedPrefixes, moduleName } = req.body;

    const newProject = {
      _id: "proj_" + Date.now(),
      moduleId,
      minMembers,
      maxMembers,
      deadline,
      // Store an array of prefixes (e.g. ["SE", "CS", "AI"])
      allowedPrefixes: allowedPrefixes || ["SE", "CS"], 
      isOpen: true,
      createdBy: req.user ? req.user.id : 'user_id_lecturer_1'
    };

    groupProjectsDb.push(newProject);

    // Add to openModulesDb so students can see it
    const isAlreadyOpen = openModulesDb.find(m => m._id === moduleId);
    if (!isAlreadyOpen) {
      openModulesDb.push({
        _id: moduleId,
        name: moduleName || `Module ${moduleId}`
      });
    }
    
    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    console.error("Error creating group project:", error);
    res.status(500).json({ success: false, message: 'Server encountered an error saving the project' });
  }
};

// POST /api/groups/:groupId/submit-finalisation (STUDENT LEADER)
exports.submitFinalisation = async (req, res) => {
  const { groupId } = req.params;
  const { tutorialGroup, memberExtraInfo, selectedPrefix } = req.body; // Student now sends their prefix!

  const group = groupsDb.find(g => g._id === groupId);
  if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

  // Rule: Ensure the group has reached the required member count before finalising
  if (group.members.length < group.maxMembers) {
    return res.status(400).json({ 
      success: false, 
      message: `You need ${group.maxMembers} members to finalise. Currently you only have ${group.members.length}.` 
    });
  }

  group.status = 'pending_review';
  group.finalisationForm = {
    tutorialGroup,    // e.g. "Group B"
    memberExtraInfo   // Array of { userId, phone, iitId, uowId }
  };
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