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

            // Initialize the attendance array if it does not exist for the sport
            if (!playerFromDb.attendance.has(student.sport)) {
                playerFromDb.attendance.set(student.sport, []);
            }

            // Get the dates for the sport
            const dates = playerFromDb.attendance.get(student.sport);

            // Ensure dates are in 'YYYY-MM-DD' format for comparison
            const formattedDates = dates.map(date => new Date(date).toISOString().split('T')[0]);

            // Check if the attendance date is already recorded for the sport
            if (!formattedDates.includes(attendanceDate)) {
                // Add the attendance date if not already present
                dates.push(attendanceDate);
            } else {
                // If the date is already present, log a message (optional)
                console.log(`Attendance date ${attendanceDate} is already recorded for player ${student.id} in sport ${student.sport}.`);
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
    const email = req.user.payload.email;
    const sport = req.params.sport;

    const coordinator = await Player.findOne({ email });
    if (!coordinator) {
        return next(new CustomError(404, 'Coordinator not found'));
    }

    if (!coordinator.coordinatorFor.includes(sport)) {
        return next(new CustomError(403, `You are not authorized to manage attendance for ${sport}`));
    }

    const isStudentCoordinator = coordinator.type.includes('student-coordinator');
    const isStudentSecretary = coordinator.type.includes('student-secretary');
    const isFacultyCoordinator = coordinator.type.includes('faculty-coordinator');
    const isFacultySecretary = coordinator.type.includes('faculty-secretary');

    if (!(isStudentCoordinator || isStudentSecretary || isFacultyCoordinator || isFacultySecretary)) {
        return next(new CustomError(403, 'You are not authorized to access this route'));
    }

    let roleFilter = [];
    if (isStudentCoordinator || isStudentSecretary) {
        roleFilter = ['student'];
    } else if (isFacultyCoordinator || isFacultySecretary) {
        roleFilter = ['faculty'];
    }

    const players = await Player.find({
        sport: sport,
        type: { $in: roleFilter }
    }, 'name id attendance');

    const today = new Date().toLocaleDateString('en-CA'); // Adjusted to local timezone
    console.log(`Today's Date in Local Timezone: ${today}`);

    const playersWithAttendance = players.map(player => {
        const attendanceForSport = player.attendance?.get(sport) || [];
        const normalizedAttendance = attendanceForSport.map(date => new Date(date).toISOString().split('T')[0]);

        const isMarkedToday = normalizedAttendance.includes(today);

        return {
            name: player.name,
            id: player.id,
            marked: isMarkedToday
        };
    });

    res.status(200).json({
        status: 'success',
        players: playersWithAttendance
    });
});







export const getPlayerAttendance = async (req, res, next) => {
    const email = req?.user?.payload?.email ;
    const sport = req?.params?.sport;

    // Check if the user is logged in
    if (!email) {
        return next(new CustomError('User is not logged in, please log in with your institute email', 401));
    }

    // Check if a sport is specified
    if (!sport) {
        return next(new CustomError('Please specify a sport', 400));
    }

    // Find the player in the database
    const playerFromDb = await Player.findOne({ email });

    // Check if the player exists
    if (!playerFromDb) {
        return next(new CustomError('Player does not exist, try contacting the developer if your name is missing', 404));
    }

    // Check for attendance records for the specified sport
    const attendanceForSport = playerFromDb.attendance.get(sport);

    // Check if attendance records are found
    if (!attendanceForSport) {
        return next(new CustomError(`No attendance records found for the sport: ${sport}`, 404));
    }

    // Determine coordinator type based on player type
    let coordinatorType;
    if (playerFromDb.type.includes('student')) {
        coordinatorType = 'student-coordinator';
    } else if (playerFromDb.type.includes('faculty')) {
        coordinatorType = 'faculty-coordinator';
    }

    // Find the appropriate coordinator who is not a secretary
    const coordinator = await Player.findOne({
        sport: sport, // Match the sport
        type: { 
            $all: [coordinatorType],  // Match the coordinator type (student-coordinator or faculty-coordinator)
            $nin: ['student-secretary', 'faculty-secretary']  // Exclude secretaries
        }
    });
    // Ensure that only one coordinator is returned
    if (!coordinator) {
        return next(new CustomError(`Coordinator for the sport: ${sport} not found`, 404));
    }

    // Get the attendance array for the coordinator for the specific sport
    const coordinatorAttendance = coordinator.attendance.get(sport) || [];

    // Return the attendance for the specific sport along with the coordinator's attendance array
    return res.status(200).json({
        status: 'success',
        data: {
            player: playerFromDb.name,
            sport: sport,
            attendance: attendanceForSport,
            coordinatorAttendance: coordinatorAttendance, // Array of dates for coordinator
        },
    });
};



// cookies permission 

//

export const stats = asyncErrorHandler(async(req, res, next) => {
    console.log(req.params);
    console.log('user', req.user);
    
    const { type, sport } = req.params;

    let coordinatorType;
    if (type === 'faculty' || type === 'faculty-coordinator') {
         coordinatorType = 'faculty-coordinator';
    }
    if (type === 'student' || type === 'student-coordinator') {
        coordinatorType = 'student-coordinator';
    }

    // Find all users of the given type and sport
    const users = await Player.find({
        type: { $in: [coordinatorType, type] },
        sport: sport
    });

    // Find the sport coordinator, but ensure they are not a secretary
    const coordinator = await Player.findOne({
        sport: sport, // Match the sport
        type: { 
            $all: [coordinatorType],  // Match the coordinator type (student-coordinator or faculty-coordinator)
            $nin: ['student-secretary', 'faculty-secretary']  // Exclude secretaries
        }
    });
    console.log(coordinator)
    // Calculate total attendance for the coordinator's specific sport
    const totalDays = coordinator?.attendance?.get(sport)?.length || 0;
    console.log(totalDays);

    let data = [];

    // Map through the users to calculate each player's attendance length for the sport
    users.forEach(user => {
        const playerAttendanceLength = user.attendance?.get(sport)?.length || 0;
        data.push({ 
            id: user.id, 
            name: user.name, 
            attendance: playerAttendanceLength 
        });
    });

    res.status(200).json({
        status: 'success',
        data: {
            totalDays, // total attendance days for the coordinator
            data      // array of player attendance
        }
    });
});



export const findCoordinatorType = asyncErrorHandler(async (req, res, next) => {
    const email = req?.user?.payload?.email;

    // Find the player by email
    const player = await Player.findOne({ email });
    if (!player) return next(new CustomError(404, 'You are not authorized to access this route'));
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


export const getPlayerForViewAttendance = async (req, res, next) => {
    // Extract the email from the request payload
    const email = req?.user?.payload?.email;

    // Find the player by email
    const playerFromDb = await Player.findOne({ email });

    // Check if the player exists
    if (!playerFromDb) {
        return res.status(404).json({
            status: 'error',
            message: `Player with email ${email} not found`
        });
    }

    // Extract the player's sports and type
    const { sport, type } = playerFromDb;

    // Determine the render key based on the player's type
    const render = type.includes('faculty') || 
                   type.includes('faculty-coordinator') || 
                   type.includes('faculty-secretary');

    // Return the response with the player's sports and render key
    return res.status(200).json({
        status: 'success',
        sports: sport, // The sports field from the player document
        render
    });
};



export const getPlayersAttendanceBySport = asyncErrorHandler(async (req, res, next) => {
    const email = req?.user?.payload?.email;
    const sport = req?.params?.sport;

    if (!email) {
        return next(new CustomError('User is not logged in, please log in with your institute email', 401));
    }

    if (!sport) {
        return next(new CustomError('Please specify a sport', 400));
    }

    // Find the coordinator based on the email, ensuring they are not secretaries
    const coordinator = await Player.findOne({
        email: email,
        sport: sport,
        'type': { $in: ['student-coordinator', 'faculty-coordinator'] },
        'type': { $nin: ['student-secretary', 'faculty-secretary'] }
    });

    if (!coordinator) {
        return next(new CustomError('Coordinator not found or does not have the required permissions', 403));
    }

    // Determine if the coordinator is for students or faculty
    const isStudentCoordinator = coordinator.type.includes('student-coordinator');
    const isFacultyCoordinator = coordinator.type.includes('faculty-coordinator');

    // Define the appropriate type to query players
    let playerType;
    if (isStudentCoordinator) {
        playerType = 'student';
    } else if (isFacultyCoordinator) {
        playerType = 'faculty';
    } else {
        return next(new CustomError('Invalid coordinator type', 400));
    }

    // Find all players of the appropriate type and sport
    const players = await Player.find({
        type: playerType,
        sport: sport
    });

    if (!players || players.length === 0) {
        return next(new CustomError(`No players found for the sport: ${sport}`, 404));
    }

    // Format the response to include player name, ID, and attendance length for the specific sport
    const playerData = players.map(player => ({
        name: player.name,
        id: player._id,
        attendanceLength: player.attendance.get(sport)?.length || 0
    }));

    // Return the list of players and their attendance data
    return res.status(200).json({
        status: 'success',
        data: playerData
    });
});
