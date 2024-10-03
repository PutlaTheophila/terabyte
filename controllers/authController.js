import asyncErrorHandler from "../utils/async-error-handler.js";
import CustomError from "../utils/customError.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import {google} from "googleapis";
import {OAuth2Client} from "google-auth-library"
 

const client = new OAuth2Client(process.env.CLIENT_ID);


export const getGoogleData = asyncErrorHandler(async(req ,res)=>{
    const {credential} = req.body;
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userId = payload['sub'];
      res.cookie('email',payload.email);
      res.status(200).json({
        status:'success',
        message: 'User verified', 
        user: payload 
    });
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








