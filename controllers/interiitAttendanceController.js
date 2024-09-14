import Player from "../models/playerModel.js";
import User from "../models/userModel.js";
import asyncErrorHandler from "../utils/async-error-handler.js";
import CustomError from "../utils/customError.js";

export const sportAttendance = asyncErrorHandler (async(req ,res ,next)=>{
    const userEmail =  req?.session?.passport?.user?.emails[0]?.value || 'putlatheophila1@gmail.com'
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

export const personalAttendance = asyncErrorHandler(async(req ,res , next)=>{
    const userEmail =  req?.session?.passport?.user?.emails[0]?.value || 'putlatheophila1@gmail.com';
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
            totalDays:totalAttendance,
            player
        }
    })
        

})


export const stats = asyncErrorHandler(async(req ,res , next)=>{
    console.log(req.params);
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