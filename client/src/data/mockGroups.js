export const modules = [
  { id: '5COSC021', name: 'Software Development Group Project (5COSC021)' },
  { id: '5COSC019C', name: 'Object Oriented Programming (5COSC019C)' },
  { id: '5COSC020', name: 'Database Systems (5COSC020)' }
];

export const groups = [
  {
    id: 'CS-97',
    moduleId: '5COSC021',
    moduleName: 'Software Development Group Project',
    domain: 'Machine Learning',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    members: 3,
    maxMembers: 5,
    joined: true,
    membersList: [
      { id: 'st1', name: 'Prabhavi', role: 'Leader', skills: ['ML', 'Python'], bio: 'AI enthusiast looking to build cool tech.' },
      { id: 'st2', name: 'Sewmini', role: 'Member', skills: ['OOP', 'Java'], bio: 'Backend specialist.' },
      { id: 'st3', name: 'Deminda', role: 'Member', skills: ['Backend', 'Node.js'], bio: 'Fullstack developer.' }
    ]
  },
  {
    id: 'CS-98',
    moduleId: '5COSC021',
    moduleName: 'Software Development Group Project',
    domain: 'Web Development',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    members: 2,
    maxMembers: 4,
    joined: false,
    membersList: []
  },
  // Added a dummy group for module view
  {
    id: 'ML-Alpha',
    moduleId: '5COSC020',
    moduleName: 'Database Systems',
    domain: 'Data Science',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    members: 1,
    maxMembers: 4,
    joined: false,
    membersList: []
  }
];

export const groupJoinRequests = [
  { id: 'req1', student: 'Adithya', groupId: 'CS-97', skills: ['React', 'UI'], bio: 'I love frontend design and animations.' },
  { id: 'req2', student: 'Anjana', groupId: 'CS-97', skills: ['ML', 'Python'], bio: 'Data analyst with 2 years experience.' }
];

export const groupInvites = [
  { 
    id: 'inv1', 
    groupId: 'CS-90', 
    domain: 'Operations', 
    members: 3, 
    maxMembers: 5, 
    moduleId: '5COSC019C',
    message: 'We need a frontend dev like you!'
  }
];

export const deadlines = [
  { title: 'Proposal Submission', date: '1st December 2025' }
];