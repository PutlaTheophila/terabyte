import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , 'you must enter the name ']
    },
    id:{
        type:String,
        required:[true , 'you must enter your institute id ']
    },
    email:{
        type:String,
        required:[true , 'please enter your email']
    },
    attendance:{
        type:[String],
        default:[]
    },
    type:{
        type:String,
        enum:['student','faculty', 'student-coordinator' ,'faculty-coordinator'],
        default:'student'
    },
    sport:{
        type:String,
        enum:['athletics' , 'badminton' , 'yoga'],
        required:[true,'you are not assigned with any sport']
    }
})

const Player = mongoose.model('player', playerSchema);

export default Player;