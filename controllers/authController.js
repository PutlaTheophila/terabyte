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
    //   res.setHeader('Set-Cookie', `authToken=${token}; Secure; SameSite=None; Max-Age=3600`);
      res.cookie('authToken',token , {
        httpOnly: true,       // Makes it inaccessible via JS (optional, if you don't need it on the frontend)
        secure: true,         // Set to true for HTTPS, false for HTTP (use false for local dev without HTTPS)
        sameSite: 'None',     // Allow cross-origin cookies
        maxAge: 3600000,      // Cookie expiration in milliseconds
      });
      res.status(200).json({
        status:'success',
        message: 'User verified', 
        user: payload 
    });
})

export const isUserLoggedIn = asyncErrorHandler(async(req ,res,next)=>{
    const user = req?.user;
    if(!user) next(new CustomError(404,'user is not logged in...'))
    res.status(200).json({
        status:'success',
        user
    })
}) 







