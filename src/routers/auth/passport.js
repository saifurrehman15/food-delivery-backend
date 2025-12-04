import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { userModel } from "../../app/auth/auth.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3004/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await userModel.findOne({ email: profile.emails[0].value });
      console.log(user);

      if (!user) {
        user = await userModel.create({
          user_name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile?.photos[0]?.value || null,
          account_type: "google",
        });
      }

      return done(null, user);
    }
  )
);

export default passport;
