import mongoose from "mongoose";
//currently user schema is coordinator schema
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true , 'please enter email ']
    },
    sport:{
        type:String,
        required:[true , 'please enter sport']
    },
    image:{
        type:String
    },
    students:{
        type:[Object],
    },
    type:{
        type:String,
        enum:['student','faculty'],
        default:'student'
    },
    // corresponding to a date key the value would be the array of studentId's who attended on that date
    attendance:{
        type:Object
    }   
});

const User = mongoose.model('user', userSchema);

export default User;