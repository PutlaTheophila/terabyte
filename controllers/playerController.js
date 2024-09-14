import { places } from "googleapis/build/src/apis/places/index.js";
import Player from "../models/playerModel.js";
import asyncErrorHandler from "../utils/async-error-handler.js";
import CustomError from "../utils/customError.js";

export const createPlayer = asyncErrorHandler(async(req , res , next)=>{
    const data = req.body;
    const player = await Player.create(data);
    res.status(200).json({
        status:'success',
        data:player
    })
})

export const getPlayer = asyncErrorHandler(async (req  , res , next)=>{    
    const  id = req.params.id
    console.log(id);
    const player = await Player.find({_id:id});
    res.status(200).json({
        status:'sucess',
        data:{
            player
        }
    })
})

export const getAllPlayers = asyncErrorHandler(async(req ,res , next)=>{
    const players = await Player.find({});
    res.status(200).json({
        status:'sucess',
        players
    })
})

// export const updatePlayer = asyncErrorHandler(async (req ,res , next)=>{
//     const { email } = req.body; 
//     const updatedData = req.body; 
//         // Find the player by email and update
//     const updatedPlayer = await Player.findOneAndUpdate(
//         { email: email }, // Find by email
//         updatedData, // Update data
//         {
//             new: true, // Return the updated document
//             runValidators: true, // Ensure the new data adheres to the schema's validation
//         }
//     )
//     const user = await Player.find({email})
//     if (!updatedPlayer || !user) return next(new CustomError('no user found  with this email' , 200));
//     res.status(200).json({
//         status:'success',
//         data:user
//     })
// })

export const updatePlayer = (id , data) =>{
    return asyncErrorHandler(async (req , res , next) =>{
        const updatedPlayer = await Player.findOneAndUpdate(
            { id: id }, // Find by email
            data, // Update data
            {
                new: true, // Return the updated document
                runValidators: true, // Ensure the new data adheres to the schema's validation
            }
        )
        const user = await Player.find({email})
        if (!updatedPlayer || !user) return next(new CustomError('no user found  with this email' , 200));
        res.status(200).json({
            status:'success',
            data:user
        })
    })
}