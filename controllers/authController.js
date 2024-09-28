import asyncErrorHandler from "../utils/async-error-handler.js";
import CustomError from "../utils/customError.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";


export const findUser = asyncErrorHandler(async(req ,res , next) =>{
    console.log('session id',req?.sessionID);
    console.log('passport user',req.user)
    const sessionId = req?.sessionID;
    let user;
    const Session = mongoose.connection.useDb('cineflex').collection('sessions');
    try {
        user = await Session.find({_id:sessionId}).toArray();
        console.log('Number of sessions:', user);
    } catch (err) {
        console.error('Error counting sessions:', err);
    }
    if(!user){
        return next( new CustomError('you are not logged in please log in' , 404));
    }
    console.log('user',req?.user);
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

// wanna add the logout functionality to the app in the nso nav bar




