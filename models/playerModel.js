import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'You must enter the name']
    },
    id: {
        type: String,
        required: [true, 'You must enter your institute ID'],
        unique: true 
    },
    email: {
        type: String,
        required: [true, 'Please enter your email']
    },
    attendance: {
        type: Map,  
        of: [Date],  
        default: {}  
    },
    type: {
        type: String,
        enum: ['student', 'faculty', 'student-coordinator', 'faculty-coordinator', 'secretary'],
        default: 'student'
    },
    sport: [{
        type: String,
        enum: ['football', 'basketball', 'cricket','volleyball','table-tennis','athletics'],
        required: [true, 'You are not assigned with any sport']
    }]
});

const Player = mongoose.model('Player', playerSchema);
//

export default Player;
