const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/appointment');


const mentoringCategories = [
    { id: 'cat_1', title: 'Machine Learning', img: '/images-d/machine.png', role: 'faculty' },
    { id: 'cat_2', title: 'System Architecture', img: '/images-d/system.jpg', role: 'faculty' },
    { id: 'cat_3', title: 'User Interface Design', img: '/images-d/ui.jpg', role: 'faculty' },
    { id: 'cat_4', title: 'Database Security', img: '/images-d/security.jpg', role: 'faculty' },
    { id: 'cat_5', title: 'Cloud Computing', img: '/images-d/cloud.jpg', role: 'faculty' },
    { id: 'cat_6', title: 'Study Tips', img: '/images-d/study.jpg', role: 'peer-mentor' },
    { id: 'cat_7', title: 'Project Help', img: '/images-d/project.png', role: 'peer-mentor' },
    { id: 'cat_8', title: 'Exam Prep', img: '/images-d/exam.jpg', role: 'peer-mentor' },
    { id: 'cat_9', title: 'Coding Help', img: '/images-d/code.png', role: 'peer-mentor' },
    { id: 'cat_10', title: 'Time Management', img: '/images-d/time.jpg', role: 'peer-mentor' }
];

exports.getMentors = async (req, res) => {
    try {
        const { role } = req.query;
        let dbQuery = {};
        if (role === 'faculty') {
            dbQuery.role = 'lecturer';
        } else if (role === 'peer-mentor') {
            dbQuery.role = 'student';
            dbQuery.isPeerMentor = true;
        } else {
            return res.json([]);
        }
        const mentors = await User.find(dbQuery).select('-password');
        res.json(mentors);
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

exports.searchMentors = async (req, res) => {
    try {
        const { query, role } = req.query;
        let dbQuery = {};
        if (role === 'faculty') {
            dbQuery.role = 'lecturer';
        } else if (role === 'peer-mentor') {
            dbQuery.role = 'student';
            dbQuery.isPeerMentor = true;
        } else {
            return res.json([]);
        }
        if (query) {
            dbQuery.$or = [
                { name: { $regex: query, $options: 'i' } },
                { expertise: { $regex: query, $options: 'i' } }
            ];
        }
        const filteredMentors = await User.find(dbQuery).select("-password");
        res.json(filteredMentors);
    } catch (error) {
        res.status(500).json({ message: "Search failed", error });
    }
};


exports.getAppointments = async (req, res) => {
    try {
        const { mentorId, studentId } = req.query;
        let query = {};

        if (mentorId) {
            if (!mongoose.Types.ObjectId.isValid(mentorId)) {
                return res.status(400).json({ message: "Invalid mentorId" });
            }
            query.mentorId = new mongoose.Types.ObjectId(mentorId);
        }
        if (studentId) query.studentId = studentId;

        const appointments = await Appointment.find(query);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error });
    }
};

exports.bookSession = async (req, res) => {
    try {
        const { mentorId, date, time } = req.body;

        if (!mongoose.Types.ObjectId.isValid(mentorId)) {
            return res.status(400).json({ message: "Invalid mentorId" });
        }

        const isBusy = await Appointment.findOne({
            mentorId: new mongoose.Types.ObjectId(mentorId),
            date,
            time,
            status: 'Accepted'
        });

        if (isBusy) {
            return res.status(400).json({ message: "Slot unavailable." });
        }
        
        const mentor = await User.findById(mentorId).select('name');
        const mentorName = mentor ? mentor.name : 'Unknown Mentor';

        const newBooking = await Appointment.create({
            ...req.body,
            mentorName,
            status: 'Pending'
        });

        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ message: "Booking failed", error });
    }
};


exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid appointment ID format." });
        }

        let updateData = { status };
        if (status === 'Accepted') {
            updateData.link = `https://zoom.us/j/${Math.floor(Math.random() * 9000000000)}`;
        }
        const updatedApp = await Appointment.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedApp) {
            return res.status(404).json({ success: false, message: "Appointment not found." });
        }
        res.status(200).json({ success: true, message: "Status updated successfully.", data: updatedApp });
    } catch (error) {
        console.error("Status Update Error:", error);
        res.status(500).json({ success: false, message: "Server failed to update status.", error: error.message });
    }
};

exports.registerAsPeerMentor = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        if (user.role !== 'student') {
            return res.status(403).json({ success: false, message: "Only students can register as peer mentors." });
        }
        user.isPeerMentor = true;
        await user.save();
        res.json({ success: true, message: "Activation successful! You are now a Peer Mentor." });
    } catch (error) {
        console.error("Peer Mentor Registration Error:", error);
        res.status(500).json({ success: false, message: "Registration failed.", error: error.message });
    }
};