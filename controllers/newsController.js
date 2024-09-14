import express from "express";
import asyncErrorHandler from "../utils/async-error-handler.js";
import News from "../models/newsModel.js"

export const createPost = asyncErrorHandler(async (req , res , next) =>{
    const data = req.body;
    const post = await News.create({...data});
    res.status(200).json({
        status:'sucess',
        data:{
            post
        }
    })
})

export const getAllNews = asyncErrorHandler(async(req ,res , next)=>{
    const news = await News.find({});
    console.log(req.session);
    res.status(200).json({
        status:'sucess',
        data:{
            nbHits:news.length,
            news
        }
    })
})

