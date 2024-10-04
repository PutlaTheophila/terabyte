import asyncErrorHandler from "../utils/async-error-handler.js";
import CustomError from "../utils/customError.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import {OAuth2Client} from "google-auth-library";
import dotenv from 'dotenv'
dotenv.config()
 

const client = new OAuth2Client(process.env.CLIENT_ID);

export const getGoogleData = asyncErrorHandler(async(req ,res)=>{
    const {credential} = req.body;
    console.log('token ....',credential);
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userId = payload['sub'];
      const token = jwt.sign({ payload}, process.env.JWT_SECRET, { expiresIn: '1h' });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('decoded token', decoded);
      res.setHeader('Set-Cookie', `authToken=${token}; HttpOnly; Secure; SameSite=None; Max-Age=3600`);
      res.status(200).json({
        status:'success',
        message: 'User verified', 
        user: payload 
    });
})

export const isUserLoggedIn = asyncErrorHandler(async(req ,res,next)=>{
    const user = req.user;
    if(!user) next(new CustomError('user is not logged in...'))
    res.status(200).json({
        status:'success',
        user
    })
}) 







