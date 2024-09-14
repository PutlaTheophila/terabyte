import mongoose from "mongoose";
import {Strategy} from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";



dotenv.config();

passport.serializeUser((user , done)=>{
  console.log('serialise user running .....')
  done(null ,user);

})
passport.deserializeUser((user , done)=>{
  console.log('hello...................')
  done(null ,user);
})

export default passport.use(
    new Strategy({
      clientID :process.env.CLIENT_ID,
      clientSecret:process.env.CLIENT_SECRTE,
      callbackURL: 'http://localhost:5011/api/v1/auth/google/callback',
      save:true
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    })

);

