const User = require('../models/User');

const { 
    mentoringCategories, 
    initialMentors, 
    initialAppointments 
} = require('../data/mockMentoringData');

let mentors = [...initialMentors];
let appointments = [...initialAppointments];

exports.getMentors = async (req, res) => {
    try {
        const facultyMentors = await User.find({ role: 'lecturer' });
        res.json(facultyMentors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching mentors", error });
    }
};

exports.getCategories = (req, res) => {
    try {
        const { role } = req.query; 
        if (role) {
            const filteredCats = mentoringCategories.filter(c => c.role === role);
            return res.json(filteredCats);
        }
        res.json(mentoringCategories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
};

exports.searchMentors = (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: "Search failed", error });
    }
};

exports.getAppointments = (req, res) => {
    try {
        const { mentorId, studentId } = req.query;
        if (mentorId) {
            return res.json(appointments.filter(a => a.mentorId === mentorId));
        }
        if (studentId) {
            return res.json(appointments.filter(a => a.studentId === studentId));
        }
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error });
    }
};

exports.bookSession = (req, res) => {
    try {
        const { mentorId, date, time } = req.body;

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
            ...req.body,
            status: 'Pending',
            link: '#' 
        };

        appointments.push(newBooking);
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ message: "Booking failed", error });
    }
};

exports.updateStatus = (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: "Status update failed", error });
    }
};