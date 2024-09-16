import mongoose from "mongoose";
import {Strategy} from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

passport.serializeUser(async(user , done)=>{
  console.log('serialise user running .....')
  console.log(user);
  const token = await jwt.sign({id:user?.emails[0]}, 'jbfijerbirebfuibr-efkwbfj0-njkfbjkwbhb');
  res.cookie(token);
  console.log(token);
  done(null ,user);
})
passport.deserializeUser((user , done)=>{
  console.log('hello...................' , "hello........")
  done(null ,user);
})

export default passport.use(
    new Strategy({
      clientID :process.env.CLIENT_ID,
      clientSecret:process.env.CLIENT_SECRET,
      callbackURL: 'https://terabyte-vw3n.onrender.com/api/v1/auth/google/callback',      
      save:true
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    })
);

