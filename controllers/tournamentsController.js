import asyncErrorHandler from "../utils/async-error-handler.js";
import CustomError from "../utils/customError.js";;
import tournamentsRouter from "../routes/tournamentsRoute.js";
import Tournament from "../models/tournamentModel.js";


export const createTournament = asyncErrorHandler(async(req ,res , next) => {
    const data = req.body;
    const tournament = await Tournament.create(data);
    res.status(200).json({
        status:'sucess',
        data
    })
})


export const getAllTournaments = asyncErrorHandler(async (req ,res , next) =>{
    const tournaments = await Tournament.find({});
    let modifiedTournaments=[];
    tournaments.map((tournament)=>{
        modifiedTournaments.push({ 'id' : tournament._id ,'name' : tournament.name , 'location' : tournament.location , 'participants' :tournament.participants , 'sport' :tournament.sport , 'status' : tournament.status , 'date' : tournament.date} )
    })
    console.log("hello from get all tournaments")
    console.log(modifiedTournaments)
    res.status(200).json({
        status:'sucess',
        tournaments:modifiedTournaments
    })
})

export const getTournament = asyncErrorHandler(async(req ,res , next)=>{
    const id = req?.params?.id;
    const tournament = await Tournament.findOne({_id:id});
    if(!tournament ) return next(new CustomError('no tournament found with this id ' , 201))
    res.status(200).json({
        status:'sucess',
        tournament
    })
})


export const updateTournament = asyncErrorHandler(async(req ,res ,next)=>{
    const id = req.params.id;
    const data = req.body;
    const updatedTournament = await Tournament.findByIdAndUpdate(
        id,
        data, // Update data
        {
            new: true, // Return the updated document
            runValidators: true, // Ensure the new data adheres to the schema's validation
        }
    )
    res.status(200).json({
        status:'sucess',
        message:'tournament updated sucessfully'
    })
})



// ----------------------------------------------------

export const getGoogleData = asyncErrorHandler(async(req ,res)=>{
    const {credential} = req.body;
    console.log(credential);
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
