import asyncErrorHandler from "./utils/async-error-handler.js";
import User from "./models/userModel.js";
import CustomError from "./utils/customError.js";


export const verifyIdToken = asyncErrorHandler(async(req , res ,)=>{
    const cookies = req.headers.cookie;

    // Check if cookies exist
    if (!cookies) {
        next 
      return res.status(401).json({ message: 'Access denied, no cookies provided' });
    }
  
    // Manually extract the `authToken` cookie (assuming it's a simple key=value format)
    const token = cookies.split('; ').find(cookie => cookie.startsWith('authToken='));
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied, no auth token found' });
    }
  
    const authToken = token.split('=')[1];

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    console.log(decoded);
    // Attach the decoded token data to the request (can be accessed in routes)
    req.user = decoded;
    next();
})