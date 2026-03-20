// src/controllers/mentoringController.js

// Mock Database
let mentors = [
    { id: 'f303', name: 'Dr. Nilaskshi', role: 'faculty', expertise: 'Machine Learning', tag: 'Neural Networks', email: 'n.nilaskshi@westminster.ac.uk' },
    { id: 'f306', name: 'Dr. Suresh', role: 'faculty', expertise: 'Database Security', tag: 'Backend Auth', email: 's.suresh@westminster.ac.uk' },
    { id: 'p202', name: 'Jordan', role: 'peer-mentor', expertise: 'Project Help', tag: 'React & Node.js', email: 'w1847263@my.westminster.ac.uk' },
    { id: 'p203', name: 'Casey', role: 'peer-mentor', expertise: 'Exam Prep', tag: 'Java & OOP', email: 'w1938472@my.westminster.ac.uk' }
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

// 1. GET ALL MENTORS
exports.getMentors = (req, res) => {
    res.json(mentors);
};

// 2. SEARCH MENTORS (Added this to fix your crash)
exports.searchMentors = (req, res) => {
    const { query, role } = req.query;
    let filtered = mentors;

    if (role) {
        filtered = filtered.filter(m => m.role === role);
    }
    if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(m => 
            m.name.toLowerCase().includes(q) || 
            m.tag.toLowerCase().includes(q) || 
            m.expertise.toLowerCase().includes(q)
        );
    }
    res.json(filtered);
};

// 3. GET APPOINTMENTS
exports.getAppointments = (req, res) => {
    const { mentorId, studentId } = req.query;
    if (mentorId) {
        return res.json(appointments.filter(a => a.mentorId === mentorId));
    }
    if (studentId) {
        return res.json(appointments.filter(a => a.studentId === studentId));
    }
    res.json(appointments);
};

// 4. BOOK SESSION (Fixed syntax and double-booking logic)
exports.bookSession = (req, res) => {
    const { mentorId, mentorName, studentId, studentName, topic, date, time } = req.body;

    // Validation: Check if mentor is already busy at this time
    const isBusy = appointments.some(app => 
        app.mentorId === mentorId && app.date === date && app.time === time && app.status !== 'Declined'
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

// 5. UPDATE STATUS
exports.updateStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const index = appointments.findIndex(a => a.id === id);
    
    if (index !== -1) {
        appointments[index].status = status;
        if (status === 'Accepted') {
            appointments[index].link = `https://zoom.us/j/${Math.floor(Math.random() * 9000000000)}`;
        }
        res.json(appointments[index]);
    } else {
        res.status(404).json({ message: "Appointment not found" });
    }
};