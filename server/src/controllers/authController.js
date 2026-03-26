const User=require("../models/User");
const Society = require("../models/Society");
const jwt = require("jsonwebtoken");

const getAdminEmails = () => {
  if (!process.env.ADMIN_EMAILS) return [];
  return process.env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase());
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  // Cookie options - handle both production and development
  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProduction, // true in production, false in development
    sameSite: isProduction ? "none" : "lax", // 'none' requires secure, 'lax' for development
    path: "/"
  };

  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
  console.log("Setting token cookie with options:", { ...options, token: token.substring(0, 10) + "..." });
  res.status(statusCode).cookie("token", token, options).redirect(FRONTEND_URL);
};

exports.oauthLogin = async (req, res) => {
  try {
    const { email, name, firstName, lastName, providerId, provider, photo } = req.user;
    const isAdmin = getAdminEmails().includes(email.toLowerCase());

    let user = await User.findOne({ email });

    if (user) {
      user.lastLogin = Date.now();
      if (isAdmin && user.role !== 'admin') user.role = 'admin';
      
      if (!user.providerId) {
        user.providerId = providerId;
        user.authProvider = provider;
      }
      if (!user.photo) user.photo = photo;
      await user.save();
    } else {
      let role = "lecturer";
      if (/\.\d{8,}/.test(email)) {
        role = "student";
      }
      if (isAdmin) {
        role = 'admin';
      }

      user = await User.create({
        name,
        firstName,
        lastName,
        email,
        role,
        authProvider: provider,
        providerId,
        photo,
        lastLogin: Date.now(),
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).json({ success: false, message: "OAuth login failed" });
  }
};

exports.logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/"
  });

  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
  res.redirect(FRONTEND_URL);
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(401).json({ authenticated: false, message: "User not found" });
    }

    // Auto-promote to society_leader if they lead a society
    if (user.role !== 'admin' && user.role !== 'society_leader') {
      const leadingSocieties = await Society.find({
        $or: [
          { leader: user._id },
          { leader: user._id.toString() }
        ]
      });
      if (leadingSocieties.length > 0) {
        user.role = 'society_leader';
        await user.save();
      }
    }

    res.status(200).json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, 
        photo: user.photo
      }
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ authenticated: false, message: "Server Error" });
  }
};

exports.localEmailLogin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.endsWith('@iit.ac.lk')) {
      return res.status(400).json({ success: false, message: 'Invalid email. Please log in with university email.' });
    }
    const isAdmin = getAdminEmails().includes(email.toLowerCase());
    let role = '';
    let firstNameRaw = '';

    if (isAdmin) {
      role = 'admin';
      firstNameRaw = email.split('@')[0]; 
    } else {

    // 2. Format Validation via Regex
    const studentRegex = /^([a-zA-Z]+)\.(\d{8,})@iit\.ac\.lk$/;
    const lecturerRegex = /^([a-zA-Z]+)\.([a-zA-Z])@iit\.ac\.lk$/;

    const studentMatch = email.match(studentRegex);
    const lecturerMatch = email.match(lecturerRegex);

    if (studentMatch) {
      role = 'student';
      firstNameRaw = studentMatch[1];
    } else if (lecturerMatch) {
      role = 'lecturer';
      firstNameRaw = lecturerMatch[1]; 
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format. Use name.studentid@iit.ac.lk or name.initial@iit.ac.lk' 
      });
    }
    }

    // Format Names
    const firstName = firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1);
    const lastName = 'LastName'; 
    const fullName = `${firstName} ${lastName}`;

    // Database Check/Creation
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: fullName,
        firstName,
        lastName,
        email,
        role,
        authProvider: 'local',
        lastLogin: Date.now(),
      });
    } else {
      user.lastLogin = Date.now();
      // Sync admin role if email is now in admin list
      if (isAdmin && user.role !== 'admin') user.role = 'admin';
      await user.save();
    }
    

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      user: { role: user.role }
    });

  } catch (error) {
    console.error("Local Login Error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};