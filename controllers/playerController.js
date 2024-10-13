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
    const player = await Player.find({id:id});
    res.status(200).json({
        status:'success',
        data:{
            player
        }
    })
})


export const deletePlayer = asyncErrorHandler(async (req  , res , next)=>{    
    const  email = req.body.email;
    const player = await Player.findOneAndDelete({email});
    res.status(200).json({
        status:'success',
        data:{
            player
        }
    })
})

export const getAllPlayers = asyncErrorHandler(async(req ,res , next)=>{
    const players = await Player.find({coordinatorFor:'basketball'});
    res.status(200).json({
        status:'success',
        players
    })
})

export const updatePlayer = asyncErrorHandler(async(req,res) =>{
    const email = req.body.email;
    const data = req.body.data;
    const updatedPlayer = await Player.findOneAndUpdate(
        { email:email }, // Find by email
        data
    )
    const user = await Player.find({email})
    if (!updatedPlayer || !user) return next(new CustomError('no user found  with this email' , 200));
    res.status(200).json({
        status:'success',
        data:user
    })
})

// Controller function to add multiple players
export const addMultiplePlayers = async (req, res) => {
    try {
        const { players, sport } = req.body; // Expecting { players: [...], sport: 'football' }

        if (!Array.isArray(players) || players.length === 0) {
            return res.status(400).json({ message: 'Players array is required and cannot be empty.' });
        }

        const playerDocuments = players.map(player => ({
            name: player.name,
            id: player.id,
            email: player.email,
            sport: [sport], // Specify the sport
            type: ['faculty'], // Set type to 'student'
            coordinatorFor: [] // Initialize as empty
        }));

        // Insert all player documents into the database
        const createdPlayers = await Player.insertMany(playerDocuments);

        return res.status(201).json({ message: 'Players created successfully', data: createdPlayers });
    } catch (error) {
        console.error('Error creating players:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};



