const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/auth/google/callback`
      },
      function(accessToken, refreshToken, profile, done) {
        const userEmail = profile.emails[0].value;
        const userDomain = userEmail.split('@')[1];

        // Access Control (Optional: keeping your domain check)
        if (process.env.ORG_DOMAIN && userDomain !== process.env.ORG_DOMAIN) {
            return done(null, false, { message: 'Unauthorized University Domain' });
        }

        // Extract first and last name from Google
        const firstName = profile.name?.givenName || '';
        const lastName = profile.name?.familyName || '';
        const photo = profile.photos ? profile.photos[0].value : null;

        // Bundle this data to send to our authController
        const oauthProfile = {
            name: profile.displayName,
            firstName: firstName,
            lastName: lastName,
            email: userEmail,
            providerId: profile.id,
            provider: 'google',
            photo: photo
        };

        // Pass the profile to the next step
        return done(null, oauthProfile);
      }
    ));
    
    // Notice: We completely removed serializeUser and deserializeUser!
};