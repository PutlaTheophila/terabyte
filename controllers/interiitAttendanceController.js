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



export const postAttendance = asyncErrorHandler(async (req, res, next) => {
    const data = req.body; // Get the array of students from the request body
    const posterEmail = req.user.payload.email; // Get the email of the attendance poster
    console.log('Received attendance data:', req.body);

    // Get today's date in YYYY-MM-DD format
    const attendanceDate = new Date().toISOString().split('T')[0];

    // Find the attendance poster in the database
    const posterFromDb = await Player.findOne({ email: posterEmail });
    
    // Check if the poster exists
    if (!posterFromDb) {
        return next(new CustomError(404, `Poster with email ${posterEmail} not found`));
    }

    // Iterate over each student in the request body
    const updatedStudents = await Promise.all(
        data.map(async (student) => {
            // Find the player in the database using the student ID
            const playerFromDb = await Player.findOne({ id: student.id });

            // Check if the player exists
            if (!playerFromDb) {
                return next(new CustomError(404, `Player with ID ${student.id} not found`));
            }

            // Check if the poster is a coordinator for the specified sport
            const isSportCoordinator = posterFromDb.coordinatorFor.includes(student.sport);

            if (!isSportCoordinator) {
                return next(new CustomError(403, `You are not authorized to mark attendance for ${student.sport}`));
            }

            // Check if the attendance record exists for the specified sport
            if (playerFromDb.attendance.has(student.sport)) {
                // Get the dates for the sport
                const dates = playerFromDb.attendance.get(student.sport);
                // Check if the attendance date is already recorded for the sport
                if (!dates.includes(attendanceDate)) {
                    // Add the attendance date if not already present
                    dates.push(attendanceDate);
                }
            } else {
                // If no record exists for that sport, create a new entry
                playerFromDb.attendance.set(student.sport, [attendanceDate]);
            }

            // Save the updated player document
            await playerFromDb.save();

            return playerFromDb; // Return the updated player document
        })
    );

    res.status(200).json({
        status: 'success',
        message: 'Attendance posted successfully',
        updatedStudents // Optionally return the updated student documents
    });
});






export const getPlayersForAttendance = asyncErrorHandler(async (req, res, next) => {
    const email = req.user.payload.email; // Extract the email from the user payload
    const sport = req.params.sport; // Get the sport from the URL params
    const coordinator = await Player.findOne({ email });

    // Check if the coordinator exists
    if (!coordinator) {
        return next(new CustomError(404, 'Coordinator not found'));
    }

    // Check if the sport is present in the coordinator's 'coordinatorFor' field
    if (!coordinator.coordinatorFor.includes(sport)) {
        return next(new CustomError(403, `You are not authorized to manage attendance for ${sport}`));
    }

    // Check if the user is a coordinator or secretary for students or faculty
    const isStudentCoordinator = coordinator.type.includes('student-coordinator');
    const isStudentSecretary = coordinator.type.includes('student-secretary');
    const isFacultyCoordinator = coordinator.type.includes('faculty-coordinator');
    const isFacultySecretary = coordinator.type.includes('faculty-secretary');

    // If the user is neither a coordinator nor a secretary
    if (!(isStudentCoordinator || isStudentSecretary || isFacultyCoordinator || isFacultySecretary)) {
        return next(new CustomError(403, 'You are not authorized to access this route'));
    }

    // Define the role filter for querying the players based on coordinator or secretary type
    let roleFilter = [];
    if (isStudentCoordinator || isStudentSecretary) {
        roleFilter = ['student'];
    } else if (isFacultyCoordinator || isFacultySecretary) {
        roleFilter = ['faculty'];
    }

    // Find players that match the role filter and the specified sport
    const players = await Player.find({
        sport: sport,
        type: { $in: roleFilter } // Filter by student or faculty players
    }, 'name id'); // Only return the relevant fields (name and id)

    // Check if any players were found
    if (players.length === 0) {
        return res.status(404).json({
            status: 'fail',
            message: `No ${roleFilter.join('/')} players found for the specified sport (${sport})`
        });
    }

    // Log the players list for debugging
    console.log(players);

    // Return the list of players (array of objects with name and id)
    res.status(200).json({
        status: 'success',
        players: players // This will return the array of players directly
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


