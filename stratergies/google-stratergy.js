// import mongoose from "mongoose";
// import {Strategy} from "passport-google-oauth20";
// import passport from "passport";
// import dotenv from "dotenv";

// dotenv.config();

// let User;

// passport.serializeUser(async(user , done)=>{
//   console.log('serialise user running .....')
//   User = user;
//   done(null ,user);
// })
// passport.deserializeUser(async(user , done)=>{
//   console.log('hello...................')
//   done(null ,user);
// })

// export default passport.use(
//     new Strategy({
//       clientID :process.env.CLIENT_ID,
//       clientSecret:process.env.CLIENT_SECRET,
//       callbackURL: 'https://terabyte-kvey.onrender.com/api/v1/auth/google/callback',      
//       save:true
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       done(null, profile);
//     })
// );

