import asyncErrorHandler from "./utils/async-error-handler.js";
import User from "./models/userModel.js";
import CustomError from "./utils/customError.js";

export const findIfCoordinator = asyncErrorHandler(async(req ,res , next)=>{
    const user = req?.session?.passport?.user?.emails[0]?.value;
    // console.log(user);
    const coordinator = await User.findOne({email:user})
    // console.log(coordinator);
    if(!coordinator)
        return next(new CustomError('you do not have acess to this route' , 404));
    next();
})


export const isLoggedIn = asyncErrorHandler(async (req , res , next)=>{
    const user = req?.session?.passport
    if(!user){
        return next(new CustomError('user is not logged in  -- unauthorised to enter this route ' , 404));
    }
    next();
})

