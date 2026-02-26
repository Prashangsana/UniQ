const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function(passport) {
    // Strategy Config
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/google/callback`
      },
      function(accessToken, refreshToken, profile, done) {
        // User extraction logic from server.js
        const userEmail = profile.emails[0].value;
        const userDomain = userEmail.split('@')[1];

        // Access Control
        if (userDomain !== process.env.ORG_DOMAIN) {
            return done(null, false, { message: 'Unauthorized University Domain' });
        }

        // Role Assignment
        let role = 'lecturer'; 
        if (/\.\d{8,}/.test(userEmail)) {
            role = 'student';
        }

        const user = {
            googleId: profile.id,
            email: userEmail,
            name: profile.displayName,
            role: role,
            photo: profile.photos ? profile.photos[0].value : null
        };

        return done(null, user);
      }
    ));

    // Serialize/Deserialize
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
};