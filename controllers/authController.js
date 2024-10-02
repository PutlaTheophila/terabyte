import asyncErrorHandler from "../utils/async-error-handler.js";
import CustomError from "../utils/customError.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import {google} from "googleapis";
 
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://your-app.netlify.app/auth/callback'
);


export const getGoogleData = asyncErrorHandler(async(req ,res)=>{
    const {code} = req.body;
    console.log('hello');
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
        });
        const { data } = await oauth2.userinfo.get();
        console.log(data);
        res.json(data); 
    } catch (error) {
        res.status(500).send("Error logging in");
    }
})


export const findUser = asyncErrorHandler(async(req ,res , next) =>{
    console.log(req.sessionID);
    console.log(req);
    const sessionId = req.sessionID;
    let user;
    const Session = mongoose.connection.useDb('cineflex').collection('sessions');
    try {
        user = await Session.findOne({_id:sessionId}).toArray();
    } catch (err) {
        console.error('Error counting sessions:', err);
    }
    if(!user){
        return next( new CustomError('user is not logged in // invalid sessionn' , 404));
    }
    console.log(req.user);
    res.status(400).json({
        status:'success',
        message:'user logged in',
        data:{
            user:user
        }
    })
})

export const logoutUser = asyncErrorHandler(async(req, res ,next)=>{
    const id = req.session.id;
    console.log(id);
    const result = await mongoose.connection.db.collection('sessions').findOne({_id:id})

    console.log('All sessions:', result);
    res.json({
        status:'sucess',
        data:'logged out user'
    })
})


export const findCoordinator = asyncErrorHandler(async(req ,res , next)=>{
    const userEmail =  req?.session?.passport?.user?.emails[0]?.value;
    if(!userEmail){
        return next(new CustomError('user is not logged in please login again' , 404))
    }
    const coordinator = await User.findOne({email:userEmail});
    console.log('.............',coordinator)
    if(!coordinator) return next(new CustomError('you are not a coordinator you dont have access to this route' , 404 ))
    res.status(200).json({
        status:'success',
        data:{
            coordinator
        }
    })
})








