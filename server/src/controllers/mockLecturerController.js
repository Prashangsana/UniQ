const mockUser = require('../data/mockUser.json');
const mockModules = require('../data/mockModules.json');
const mockLecturers = require('../data/mockLecturers.json');
const mockStudents = require('../data/mockStudents.json');
const { groupsDb, openModulesDb } = require('./mockGroupController');

let groupProjectsDb = [];

exports.getMyModules = async (req, res) => {
  const lecturerId = req.user ? req.user.id : 'user_id_lecturer_1'; 

  const authorizedModules = mockModules.filter(m => 
    m.moduleLeaders.includes(lecturerId) || m.moduleTeam.includes(lecturerId)
  );

  const formattedModules = authorizedModules.map(m => ({ _id: m._id, name: m.name }));
  res.status(200).json({ success: true, data: formattedModules });
};

exports.getLecturerGroups = async (req, res) => {
  const lecturerId = req.user ? req.user.id : 'user_id_lecturer_1'; 

  const myModuleIds = mockModules
    .filter(m => m.moduleLeaders.includes(lecturerId) || m.moduleTeam.includes(lecturerId))
    .map(m => m._id);

  const relevantGroups = groupsDb.filter(g => myModuleIds.includes(g.moduleId));

  const pendingGroups = relevantGroups.filter(g => g.status === 'pending_review');
  const finalisedGroups = relevantGroups.filter(g => g.status === 'finalised');

  res.status(200).json({ 
    success: true, 
    data: { pending: pendingGroups, finalised: finalisedGroups }
  });
};

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
      allowedPrefixes: allowedPrefixes || ["SE", "CS"], 
      isOpen: true,
      createdBy: req.user ? req.user.id : 'user_id_lecturer_1'
    };

    groupProjectsDb.push(newProject);

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

exports.submitFinalisation = async (req, res) => {
  const { groupId } = req.params;
  const { tutorialGroup, memberExtraInfo, selectedPrefix } = req.body; 

  const group = groupsDb.find(g => g._id === groupId);
  if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

  group.status = 'pending_review';
  group.prefix = selectedPrefix;
  
  group.finalisationForm = {
    tutorialGroup,
    memberExtraInfo
  };

  res.status(200).json({ 
    success: true, 
    message: 'Submitted for review!', 
    data: group 
  });
};

exports.reviewGroup = async (req, res) => {
  const { groupId } = req.params;
  const { action, feedback } = req.body;

  const group = groupsDb.find(g => g._id === groupId);
  if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

  if (action === 'approve') {
    group.status = 'finalised';
    group.isFinalised = true;

    const chosenPrefix = group.prefix || "GRP";
    
    const count = groupsDb.filter(g => 
        g.isFinalised === true && 
        g.moduleId === group.moduleId && 
        g.prefix === chosenPrefix &&
        g._id !== group._id 
    ).length;
    
    group.finalisedCode = `${chosenPrefix}-${count + 1}`;
    group.feedback = "Approved";
  } else {
    group.status = 'open'; 
    group.isFinalised = false;
    group.feedback = feedback || "Rejected. Please update your members.";
  }

  res.status(200).json({ success: true, data: group });
};

exports.groupProjectsDb = groupProjectsDb;