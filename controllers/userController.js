import User from "../models/userModel.js";
import express from "express";
import asyncErrorHandler from "../utils/async-error-handler.js";
import CustomError from "../utils/customError.js";
import Player from "../models/playerModel.js";
const userRouter = express.Router();

export const registerUser = asyncErrorHandler(async(req ,res) =>{
    const {email,sport} = req.body;
    const user = await User.create({email,sport});
    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })
})

export const getAllUsers = asyncErrorHandler (async(req , res)=>{
    const users = await User.find({});
    res.status(200).json({
        status:'success',
        nbHits:users.length,
        users:users
    })
})

export const getUser = asyncErrorHandler (async(req , res , next)=>{
    const userEmail =  req?.session?.passport?.user?.emails[0]?.value;
    console.log(userEmail);
    if(!userEmail){
        return next(new CustomError('user is not logged in please login again' , 404))
    }
    const user = await User.findOne({email:userEmail});
    res.status(200).json({
        status:'success',
        data:user.students
    })
})

export const updateUser = asyncErrorHandler(async(req ,res , next)=>{
    const { email } = req.body; 
    const updatedData = req.body; 
        // Find the player by email and update
    const updatedPlayer = await User.findOneAndUpdate(
        { email: email }, // Find by email
        updatedData, // Update data
        {
            new: true, // Return the updated document
            runValidators: true, // Ensure the new data adheres to the schema's validation
        }
    )
    const user = await User.find({email})
    if (!updatedPlayer || !user) return next(new CustomError('no user found  with this email' , 200));
    res.status(200).json({
        status:'success',
        data:user
    })
})

// we have to move this to a separate controller file

export const deleteUser = asyncErrorHandler(async(req ,res , next)=>{
    const id = req.params.id;
    await User.findByIdAndDelete(id) 
    res.status(200).json({
        status:'sucess',
        message:'sucessfully deleted'
    })
})