import mongoose  from 'mongoose';
import app from "./app.js"
// import "dotenv/config";
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT||3013;

mongoose.connect(`mongodb+srv://theosports7:${process.env.MONGODB_SECRET}@sports.9mjtk.mongodb.net/?retryWrites=true&w=majority&appName=sports`)
.then((conn)=>{
    console.log('connected to database');
    //starting app
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
      });
})
.catch((error)=>{
    console.log(error)
})






