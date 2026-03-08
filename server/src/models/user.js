const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, 
    role: { type: String, enum: ['student', 'lecturer'], default: 'student' },
    authProvider: { type: String, default: 'local' }, 
    providerId: { type: String }, 
    
    // Your Profile specific fields
    username: { type: String ,unique:true,sparse:true},
    course: { type: String,default:'' },
    group: { type: String ,default:''},
    skills: { type: [String], default: [] },
    bio: {  type: String, maxlength: 160},
    modules: { type: [String], default: [] },
    aboutMe: {type:[String]},
    profileImage: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);