import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { UserModel } from "../models/UserModel";

// Serialize and Deserialize User
passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await UserModel.findByEmail(email);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        if (!user.password) {
          return done(null, false, { message: "User password not found" });
        }

        const isPasswordValid = await UserModel.verifyPassword(
          password,
          user.password
        );
        if (!isPasswordValid) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: `${process.env.API_URL}/auth/github/callback`,
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const email = profile.emails?.[0]?.value || null; // Fallback to null if email is missing
      const username = profile.username || `github_user_${profile.id}`; // Fallback username
      const avatar_url = profile.photos?.[0]?.value || null; // Fallback to null

      try {
        // Check if user exists in your database
        let user = await UserModel.findOrCreateGitHubUser({
          id: profile.id,
          email,
          username,
          avatar_url,
        });

        return done(null, user);
      } catch (error) {
        console.error("GitHub Strategy Error:", error);
        return done(error);
      }
    }
  )
);

export default passport;
