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

    const adminEmails = process.env.ADMIN_EMAILS 
      ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase()) 
      : [];

    const isAdmin = adminEmails.includes(userEmail.toLowerCase());

    if (!isAdmin && process.env.ORG_DOMAIN && userDomain !== process.env.ORG_DOMAIN) {
      return done(null, false, { message: 'Unauthorized University Domain' });
    }

    const firstName = profile.name?.givenName || '';
    const lastName = profile.name?.familyName || '';
    const photo = profile.photos ? profile.photos[0].value : null;

    const oauthProfile = {
      name: profile.displayName || profile.emails[0].value.split('@')[0],
      firstName: firstName,
      lastName: lastName,
      email: userEmail,
      providerId: profile.id,
      provider: 'google',
      photo: photo
    };

    return done(null, oauthProfile);
  }));
  
  // Saves the user into the session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Retrieves the user from the session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};