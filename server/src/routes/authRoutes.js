// --- MOCK DATABASE ---
let mentors = [
    { id: 'f303', name: 'Dr. Nilaskshi', role: 'faculty', expertise: 'Machine Learning', tag: 'Neural Networks', email: 'n.nilaskshi@westminster.ac.uk' },
    { id: 'f304', name: 'Prof. Johnson', role: 'faculty', expertise: 'System Architecture', tag: 'Cloud Computing', email: 'r.johnson@westminster.ac.uk' },
    { id: 'f305', name: 'Dr. Lee', role: 'faculty', expertise: 'User Interface Design', tag: 'HCI', email: 'k.lee@westminster.ac.uk' },
    { id: 'f306', name: 'Dr. Suresh', role: 'faculty', expertise: 'Database Security', tag: 'Backend Auth', email: 's.suresh@westminster.ac.uk' },
    { id: 'p202', name: 'Jordan', role: 'peer-mentor', expertise: 'Project Help', tag: 'React & Node.js', email: 'w1847263@my.westminster.ac.uk' },
    { id: 'p203', name: 'Casey', role: 'peer-mentor', expertise: 'Exam Prep', tag: 'Java & OOP', email: 'w1938472@my.westminster.ac.uk' },
    { id: 'p204', name: 'Morgan', role: 'peer-mentor', expertise: 'Study Tips', tag: 'Time Management', email: 'w1827364@my.westminster.ac.uk' },
    { id: 'p205', name: 'Taylor', role: 'peer-mentor', expertise: 'Coding Help', tag: 'Python & AI', email: 'w1736485@my.westminster.ac.uk' }
];

let appointments = [
    { 
        id: 'app_001', studentId: 's101', studentName: 'Alex', 
        mentorId: 'f303', mentorName: 'Dr. Nilaskshi', 
        topic: 'Machine Learning FYP', status: 'Accepted', 
        date: '2026-03-25', time: '14:00', link: 'https://zoom.us/j/9988776655' 
    },
    { 
        id: 'app_002', studentId: 's101', studentName: 'Alex', 
        mentorId: 'p202', mentorName: 'Jordan', 
        topic: 'React Context API help', status: 'Pending', 
        date: '2026-03-28', time: '10:00 AM', link: '#' 
    }
];

// --- 3. SESSION CLEANUP LOGIC ---
// Helper to archive past sessions automatically
const cleanupPastSessions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    appointments.forEach(app => {
        const sessionDate = new Date(app.date);
        if (sessionDate < today && app.status === 'Accepted') {
            app.status = 'Completed';
        }
    });
};

// --- CONTROLLER FUNCTIONS ---

// Logic to get appointments (with automatic cleanup)
exports.getAppointments = (req, res) => {
    cleanupPastSessions();
    
    const { mentorId, studentId } = req.query;

    if (mentorId) {
        const filtered = appointments.filter(a => a.mentorId === mentorId);
        return res.json(filtered);
    }
    if (studentId) {
        const filtered = appointments.filter(a => a.studentId === studentId);
        return res.json(filtered);
    }
    
    res.json(appointments);
};

// --- 2. DOUBLE-BOOKING PREVENTION ---
exports.bookSession = (req, res) => {
    const { mentorId, mentorName, studentId, studentName, topic, date, time } = req.body;

    // Check if the mentor is already booked for this specific slot
    const isBusy = appointments.some(app => 
        app.mentorId === mentorId && 
        app.date === date && 
        app.time === time &&
        app.status !== 'Declined'
    );

    if (isBusy) {
        return res.status(400).json({ 
            message: "Slot unavailable. This mentor already has a session at this time." 
        });
    }

    const newBooking = {
        id: `app_${Date.now()}`,
        studentId,
        studentName,
        mentorId,
        mentorName,
        topic,
        status: 'Pending',
        date,
        time,
        link: '#' 
    };

    appointments.push(newBooking);
    res.status(201).json(newBooking);
};

// --- 4. SEARCH & FILTER ENDPOINT ---
exports.searchMentors = (req, res) => {
    const { query, role } = req.query; 
    
    let filtered = mentors;

    if (role) {
        filtered = filtered.filter(m => m.role === role);
    }

    if (query) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(m => 
            m.name.toLowerCase().includes(lowerQuery) || 
            m.tag.toLowerCase().includes(lowerQuery) ||
            m.expertise.toLowerCase().includes(lowerQuery)
        );
    }

    res.json(filtered);
};

// Logic to return full mentors list
exports.getMentors = (req, res) => {
    res.json(mentors);
};

// --- 1. AUTOMATED LINK GENERATION ---
exports.updateStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const index = appointments.findIndex(a => a.id === id);
    
    if (index !== -1) {
        appointments[index].status = status;

        // Automatically generate a link if the mentor accepts
        if (status === 'Accepted') {
            const meetingId = Math.floor(100000000 + Math.random() * 900000000);
            appointments[index].link = `https://zoom.us/j/${meetingId}`;
        }
        
        res.json(appointments[index]);
    } else {
        res.status(404).json({ message: "Appointment not found" });
    }
};