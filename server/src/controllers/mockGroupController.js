const mockUser = require('../data/mockUser.json');
const mockStudents = require('../data/mockStudents.json');
const mockGroups = require('../data/mockGroups.json');

let groupsDb = [...mockGroups];

let openModulesDb = [
  { _id: '5COSC019C', name: 'Software Engineering' }
];

exports.openModulesDb = openModulesDb;

exports.getOpenModules = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: openModulesDb });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching modules' });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { name, moduleId, domain, maxMembers } = req.body;
    const userId = req.user.id;

    const { groupProjectsDb } = require('./mockLecturerController');

    const projectSettings = groupProjectsDb.find(p => p.moduleId === moduleId);

    const allowedMax = projectSettings ? projectSettings.maxMembers : 5;

    const existingGroup = groupsDb.find(g => 
      g.moduleId === moduleId && g.members.some(m => m._id === userId)
    );

    if (existingGroup) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already a member of a group for this module.' 
      });
    }

    const newGroup = {
      _id: "grp_" + Date.now(),
      name,
      moduleId,
      domain,
      maxMembers: allowedMax,
      leader: req.user, 
      members: [req.user], 
      isFinalised: false,
      status: 'open'
    };

    groupsDb.push(newGroup);
    res.status(201).json({ success: true, data: newGroup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getModuleGroups = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const moduleGroups = groupsDb.filter(g => g.moduleId === moduleId);

    const formattedGroups = moduleGroups.map(group => ({
      _id: group._id,
      name: group.name,
      domain: group.domain,
      memberCount: group.members.length,
      maxMembers: group.maxMembers,
      isFinalised: group.isFinalised,
      leader: group.leader._id
    }));

    res.status(200).json({ success: true, count: formattedGroups.length, data: formattedGroups });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { groupProjectsDb } = require('./mockLecturerController');

    const group = groupsDb.find(g => g._id === groupId);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    const responseData = {
      ...group,
      finalisationForm: group.finalisationForm || null 
    };

    const project = groupProjectsDb.find(p => p.moduleId === group.moduleId);
    if (project) {
      group.maxMembers = project.maxMembers;
    }

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getAvailableStudents = async (req, res) => {
  try {
    res.status(200).json({ 
      success: true, 
      count: mockStudents.length, 
      data: mockStudents 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getMyGroup = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user.id; 
    const { groupProjectsDb } = require('./mockLecturerController');

    const myGroup = groupsDb.find(g => 
      g.moduleId === moduleId && 
      g.members.some(m => m._id === userId || m === userId)
    );

    if (!myGroup) {
      return res.status(200).json({ success: true, data: null });
    }

    const project = groupProjectsDb.find(p => p.moduleId === moduleId);
    if (project) {
      myGroup.maxMembers = project.maxMembers;
    }

    res.status(200).json({ success: true, data: myGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getMyAllGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const myGroups = groupsDb.filter(g => 
      g.members.some(m => m._id === userId || m === userId)
    );
    res.status(200).json({ success: true, data: myGroups });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.groupsDb = groupsDb;