import Player from "../models/playerModel.js";

import asyncErrorHandler from "../utils/async-error-handler.js";
import CustomError from "../utils/customError.js";

export const sportAttendance = asyncErrorHandler (async(req ,res ,next)=>{
    const userEmail =  req?.user?.payload?.email;
    console.log(userEmail);
    const coordinator = await User.findOne({email:userEmail});
    if(!coordinator){
        return next(new CustomError('you cannot have access to this route' , 404))
    }
    const coordinatorType = coordinator.type;
    const players = await Player.find({type : coordinator.type.toString(),sport:coordinator.sport.toString()})
    console.log(players);
    let data = [];    
    players.map((element)=>{
        data.push({'name':element.name, 'id':element.id , 'attendance':element.attendance.length})
    })
    console.log(coordinator?.type);
    res.status(200).json({
        status:'success',
        message:'hello',
        data:data
    })
})


export const postAttendance = asyncErrorHandler(async(req ,res , next)=>{
    const data = req.body;
    console.log(data);

    const updatedStudents = await Promise.all(
        data.map((student) => {
            const studentFromDb = Player.findOneAndUpdate(
                { id: student.id },  // Find by student id
                { $addToSet: { attendance: '2023-09-11' } },  // Add the new attendance date if not already present
                { new: true, upsert: false } 
            );
            return studentFromDb;
        })
    );
    res.status(200).json({
        status:'success',
        message:'attendance posted successfully'
    })
})


export const getPlayersForAttendance = asyncErrorHandler(async (req, res, next) => {
    const email = req?.user?.payload?.email;
    const sport = req?.params?.sport;
    console.log(email,sport);
    const coordinator = await Player.findOne({ email });

    // Check if coordinator exists
    if (!coordinator) {
        return next(new CustomError(404, 'user not logged in please login '));
    }

    // Check if the player is a coordinator or secretary
    const isStudentCoordinator = coordinator.type.includes('student-coordinator');
    const isStudentSecretary = coordinator.type.includes('student-secretary');
    const isFacultyCoordinator = coordinator.type.includes('faculty-coordinator');
    const isFacultySecretary = coordinator.type.includes('faculty-secretary');

    // If the user is neither a student nor faculty coordinator or secretary
    if (!(isStudentCoordinator || isStudentSecretary || isFacultyCoordinator || isFacultySecretary)) {
        return next(new CustomError(403, 'You are not authorized to access this route'));
    }

    // Determine the roles to filter by
    let roleFilter = [];
    if (isStudentCoordinator || isStudentSecretary) {
        roleFilter = ['student-player'];
    } else if (isFacultyCoordinator || isFacultySecretary) {
        roleFilter = ['faculty-player'];
    }

    // Find players matching the role and sport
    const players = await Player.find({
        sport: sport,
        type: { $in: roleFilter }
    }, 'name id sport type'); // Return only specific fields

    // Check if no players were found
    if (players.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No players found for the specified sport and role'
        });
    }

    // Group players by sport (even though there's only one sport)
    const groupedPlayers = {
        [sport]: players.map(player => ({ name: player.name, id: player.id }))
    };

    // Return the grouped players
    res.status(200).json({
        status: 'success',
        players: groupedPlayers
    });
});


export const personalAttendance = asyncErrorHandler(async(req ,res , next)=>{
    const userEmail =  req?.user?.payload?.email;
    console.log(userEmail);
    if(!userEmail){
        return next(new CustomError('user is not logged in please log in or try to login with institue email '))
    }
    console.log(userEmail);
    const player = await Player.findOne({email:userEmail})
    if(!player) return next(new CustomError('player does not exist , try contacting developer if your name is missing' , 404))
    console.log(player)
    let coordinatorType;
    if (player.type === 'faculty' || 'faculty-coordinator') coordinatorType = 'faculty-coordinator';
    if(player.type === 'student' || 'student-coordinator') coordinatorType = 'student-coordinator';

    const coordinator = await Player.findOne({type:coordinatorType , sport:player.sport.toString()})
    const totalAttendance = coordinator.attendance;
    if(!player) return next(new CustomError('invalid user / try to login using institute email ' , 404))
    res.status(200).json({
        status:'success',
        data:{
            totalDays : totalAttendance,
            player
        }
    })        
})
//

export const stats = asyncErrorHandler(async(req ,res , next)=>{
    console.log(req.params);
    console.log('user',req.user);
    const {type , sport} = req.params;

    let coordinatorType;
    if (type === 'faculty' || 'faculty-coordinator'){
         coordinatorType = 'faculty-coordinator';
    }
    if(type === 'student' || 'student-coordinator');{
        coordinatorType = 'student-coordinator';
    }
    
    const users = await Player.find({type:{$in:[coordinatorType.toString(), type.toString()]} ,sport:sport})
    console.log(users);


    const coordinator = await Player.findOne({type:coordinatorType , sport:sport})
    const totalDays = coordinator?.attendance?.length;
    let data=[];

    users.map((user)=>{
        data.push({'id':user.id  , 'name' : user.name , 'attendance':user.attendance.length}) 
    })

    console.log(data);
    res.status(200).json({
        status:'success',
        data:{
            totalDays,
            data
        }
    })
})


export const findCoordinatorType = asyncErrorHandler(async (req, res, next) => {
    const email = req?.user?.payload?.email;

    // Find the player by email
    const player = await Player.findOne({ email });
    console.log(email, player);

    // If no player is found, return a 404 error
    if (!player) return next(new CustomError(404, 'You are not authorized to access this route'));

    // Check the player's type
    const isStudentCoordinator = player.type.includes('student-coordinator');
    const isStudentSecretary = player.type.includes('student-secretary');
    const isFacultyCoordinator = player.type.includes('faculty-coordinator');
    const isFacultySecretary = player.type.includes('faculty-secretary');

    // Determine the render value based on the player's type
    const render = isStudentCoordinator || isStudentSecretary;

    // Prepare the response
    const response = {
        render,  // true for student roles, false for faculty roles
        coordinatorSports: (isStudentCoordinator || isStudentSecretary || isFacultyCoordinator || isFacultySecretary)
            ? player.coordinatorFor
            : [],  // List of sports the player coordinates for, if applicable
        coordinatorOf: player.coordinatorFor // Include the array of sports the player is coordinator of
    };

    // Return the response
    res.status(200).json({
        data: response
    });
});


