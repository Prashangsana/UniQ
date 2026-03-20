const User = require("../models/User");
const jwt = require("jsonwebtoken");

const sendTokenResponse = (user, statusCode, res) => {
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

  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
  res.status(statusCode).cookie("token", token, options).redirect(FRONTEND_URL);
};

exports.googleCallback = async (req, res) => {
  try {
    const { email, name, firstName, lastName, providerId, provider, photo } = req.user;

    let user = await User.findOne({ email });

    if (user) {
      user.lastLogin = Date.now();
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
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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