const mentoringCategories = [
    // Faculty-Focused Categories
    { id: 'cat_1', title: 'Machine Learning', img: '/images-d/machine.png', role: 'faculty' },
    { id: 'cat_2', title: 'System Architecture', img: '/images-d/system.jpg', role: 'faculty' },
    { id: 'cat_3', title: 'User Interface Design', img: '/images-d/ui.jpg', role: 'faculty' },
    { id: 'cat_4', title: 'Database Security', img: '/images-d/security.jpg', role: 'faculty' },
    { id: 'cat_5', title: 'Cloud Computing', img: '/images-d/cloud.jpg', role: 'faculty' },
    // Peer-Focused Categories
    { id: 'cat_6', title: 'Study Tips', img: '/images-d/study.jpg', role: 'peer-mentor' },
    { id: 'cat_7', title: 'Project Help', img: '/images-d/project.png', role: 'peer-mentor' },
    { id: 'cat_8', title: 'Exam Prep', img: '/images-d/exam.jpg', role: 'peer-mentor' },
    { id: 'cat_9', title: 'Coding Help', img: '/images-d/code.png', role: 'peer-mentor' },
    { id: 'cat_10', title: 'Time Management', img: '/images-d/time.jpg', role: 'peer-mentor' }
];

const initialMentors = [
    // --- 10 LECTURER MENTORS ---
    { id: 'f301', name: 'Dr. Nilaskshi', role: 'faculty', expertise: 'Machine Learning', tag: 'Neural Networks', email: 'n.nilaskshi@westminster.ac.uk', img: '/images-d/machine.png', bio: 'AI Researcher.', rating: 4.9 },
    { id: 'f302', name: 'Prof. Johnson', role: 'faculty', expertise: 'System Architecture', tag: 'Cloud', email: 'j.johnson@westminster.ac.uk', img: '/images-d/system.jpg', bio: 'Cloud Architect.', rating: 4.8 },
    { id: 'f303', name: 'Dr. Suresh', role: 'faculty', expertise: 'Database Security', tag: 'Cyber', email: 's.suresh@westminster.ac.uk', img: '/images-d/security.jpg', bio: 'Security Expert.', rating: 4.7 },
    { id: 'f304', name: 'Dr. Emily', role: 'faculty', expertise: 'User Interface Design', tag: 'UX/UI', email: 'e.brown@westminster.ac.uk', img: '/images-d/ui.jpg', bio: 'HCI specialist.', rating: 4.6 },
    { id: 'f305', name: 'Prof. Miller', role: 'faculty', expertise: 'Cloud Computing', tag: 'AWS', email: 'm.miller@westminster.ac.uk', img: '/images-d/cloud.jpg', bio: 'Serverless pro.', rating: 4.5 },
    { id: 'f306', name: 'Dr. Sarah', role: 'faculty', expertise: 'Machine Learning', tag: 'NLP', email: 's.sarah@westminster.ac.uk', img: '/images-d/machine.png', bio: 'Language modeling.', rating: 4.9 },
    { id: 'f307', name: 'Dr. David', role: 'faculty', expertise: 'System Architecture', tag: 'Microservices', email: 'd.david@westminster.ac.uk', img: '/images-d/system.jpg', bio: 'Distributed systems.', rating: 4.7 },
    { id: 'f308', name: 'Dr. Aruni', role: 'faculty', expertise: 'Database Security', tag: 'SQL', email: 'a.aruni@westminster.ac.uk', img: '/images-d/security.jpg', bio: 'Data integrity.', rating: 4.8 },
    { id: 'f309', name: 'Prof. Robert', role: 'faculty', expertise: 'User Interface Design', tag: 'Figma', email: 'r.robert@westminster.ac.uk', img: '/images-d/ui.jpg', bio: 'Design lead.', rating: 4.4 },
    { id: 'f310', name: 'Dr. Kevin', role: 'faculty', expertise: 'Cloud Computing', tag: 'Azure', email: 'k.kevin@westminster.ac.uk', img: '/images-d/cloud.jpg', bio: 'Enterprise Cloud.', rating: 4.6 },

    // --- 10 PEER MENTORS ---
    { id: 'p201', name: 'Jordan', role: 'peer-mentor', expertise: 'Project Help', tag: 'React', email: 'w184@my.westminster.ac.uk', img: '/images-d/project.png', year: 'Year 3', completedSessions: 12 },
    { id: 'p202', name: 'Casey', role: 'peer-mentor', expertise: 'Exam Prep', tag: 'Java', email: 'w193@my.westminster.ac.uk', img: '/images-d/exam.jpg', year: 'Year 2', completedSessions: 8 },
    { id: 'p203', name: 'Morgan', role: 'peer-mentor', expertise: 'Study Tips', tag: 'Planning', email: 'w182@my.westminster.ac.uk', img: '/images-d/study.jpg', year: 'Year 3', completedSessions: 15 },
    { id: 'p204', name: 'Taylor', role: 'peer-mentor', expertise: 'Coding Help', tag: 'Python', email: 'w173@my.westminster.ac.uk', img: '/images-d/code.png', year: 'Year 1', completedSessions: 5 },
    { id: 'p205', name: 'Riley', role: 'peer-mentor', expertise: 'Time Management', tag: 'Focus', email: 'w185@my.westminster.ac.uk', img: '/images-d/time.jpg', year: 'Year 2', completedSessions: 10 },
    { id: 'p206', name: 'Alex P.', role: 'peer-mentor', expertise: 'Project Help', tag: 'Node.js', email: 'w186@my.westminster.ac.uk', img: '/images-d/project.png', year: 'Year 3', completedSessions: 18 },
    { id: 'p207', name: 'Sam', role: 'peer-mentor', expertise: 'Exam Prep', tag: 'C++', email: 'w187@my.westminster.ac.uk', img: '/images-d/exam.jpg', year: 'Year 2', completedSessions: 7 },
    { id: 'p208', name: 'Jamie', role: 'peer-mentor', expertise: 'Study Tips', tag: 'Notes', email: 'w188@my.westminster.ac.uk', img: '/images-d/study.jpg', year: 'Year 1', completedSessions: 3 },
    { id: 'p209', name: 'Dakota', role: 'peer-mentor', expertise: 'Coding Help', tag: 'HTML/CSS', email: 'w189@my.westminster.ac.uk', img: '/images-d/code.png', year: 'Year 2', completedSessions: 11 },
    { id: 'p210', name: 'Skyler', role: 'peer-mentor', expertise: 'Time Management', tag: 'Agile', email: 'w190@my.westminster.ac.uk', img: '/images-d/time.jpg', year: 'Year 3', completedSessions: 9 }
];

// 2 Available slots for each mentor
const initialAvailability = initialMentors.map(mentor => ({
    mentorId: mentor.id,
    date: '2026-03-25',
    slots: mentor.role === 'faculty' ? ['09:00', '14:00'] : ['10:00 AM', '03:00 PM']
}));

const initialAppointments = [
    { id: 'app_001', studentId: 's101', studentName: 'Alex', mentorId: 'f301', mentorName: 'Dr. Nilaskshi', topic: 'ML Help', status: 'Accepted', date: '2026-03-25', time: '14:00', link: 'https://zoom.us/j/998877' },
    { id: 'app_002', studentId: 's101', studentName: 'Alex', mentorId: 'p201', mentorName: 'Jordan', topic: 'React Props', status: 'Pending', date: '2026-03-28', time: '10:00 AM', link: '#' },
    { id: 'app_003', studentId: 's101', studentName: 'Alex', mentorId: 'f303', mentorName: 'Dr. Suresh', topic: 'SQL Auth', status: 'Requested', date: '2026-04-02', time: '09:00', link: '#' }
];

module.exports = {
    mentoringCategories,
    initialMentors,
    initialAvailability,
    initialAppointments
};