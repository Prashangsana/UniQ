const mockUser = require('../data/mockUser.json');

// This array acts as our temporary MongoDB
let groupsDb = [
  {
    _id: "test_group_123",
    name: "CS-105-Alpha",
    moduleId: "5COSC019C", // (Or whichever module ID you used)
    domain: "Web Development",
    maxMembers: 5,
    leader: { _id: "fake_leader", name: "System Admin" },
    
    // --- THE FIX IS HERE --- 
    // We removed mockUser so you aren't in the group yet!
    members: [{ _id: "fake_leader", name: "System Admin" }], 
    // -----------------------
    
    isFinalised: false
  }
];

exports.createGroup = async (req, res) => {
  try {
    const { name, moduleId, domain, maxMembers } = req.body;
    const userId = req.user.id;

    // Constraint Check: Prevent multiple groups per module
    const existingGroup = groupsDb.find(g => 
      g.moduleId === moduleId && g.members.some(m => m._id === userId)
    );

    if (existingGroup) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already a member of a group for this module.' 
      });
    }

    // Create the group and push to our array
    const newGroup = {
      _id: "grp_" + Date.now(), // Generate a fake MongoDB _id
      name,
      moduleId,
      domain,
      maxMembers,
      leader: mockUser, 
      members: [mockUser], // Store the full mock user to simulate "populate()"
      isFinalised: false
    };

    groupsDb.push(newGroup);
    res.status(201).json({ success: true, data: newGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getModuleGroups = async (req, res) => {
  try {
    const { moduleId } = req.params;

    // Filter array by module
    const moduleGroups = groupsDb.filter(g => g.moduleId === moduleId);

    // Format response exactly how the real controller does
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

    // Find specific group in array
    const group = groupsDb.find(g => g._id === groupId);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.status(200).json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET /api/modules/:moduleId/available-students
exports.getAvailableStudents = async (req, res) => {
  try {
    // Create a dummy list of students for the mock roster
    const dummyStudents = [
      {
        _id: "user_roster_1",
        name: "Kamal Perera",
        skills: ["Java", "Spring Boot", "SQL"],
        bio: "Backend specialist looking for a heavy database project."
      },
      {
        _id: "user_roster_2",
        name: "Sarah Silva",
        skills: ["Figma", "React", "CSS"],
        bio: "Frontend developer and UI designer."
      },
      {
        _id: mockUser._id, // Adding mock user as one of the options too!
        name: mockUser.name,
        skills: mockUser.skills,
        bio: mockUser.bio
      }
    ];

    res.status(200).json({ success: true, count: dummyStudents.length, data: dummyStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET /api/modules/:moduleId/my-group
exports.getMyGroup = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user.id; 

    // Find a group for this module where the members array includes our mock user
    const myGroup = groupsDb.find(g => 
      g.moduleId === moduleId && 
      g.members.some(m => m._id === userId || m === userId)
    );

    if (!myGroup) {
      // User is not in a group, send back null
      return res.status(200).json({ success: true, data: null });
    }

    // User is in a group, send the group data
    res.status(200).json({ success: true, data: myGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET /api/groups/my
exports.getMyAllGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all groups where you are a member
    const myGroups = groupsDb.filter(g => 
      g.members.some(m => m._id === userId || m === userId)
    );
    res.status(200).json({ success: true, data: myGroups });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Add this at the very bottom of mockGroupController.js
exports.groupsDb = groupsDb;