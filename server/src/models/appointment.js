const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentorName: {          
        type: String
    },
    studentId: {
        type: String,
        required: true
    },
    studentName: {
        type: String
    },
    topic: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Declined'],
        default: 'Pending'
    },
    link: {
        type: String,
        default: '#'
    }
}, { timestamps: true });

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);