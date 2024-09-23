import mongoose  from 'mongoose';
import app from "./app.js"
import "dotenv/config";
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT||3000;

mongoose.connect('mongodb+srv://putlat:LjPde0OWQxHLwLrU@cluster0.w4qzg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then((conn)=>{
    console.log('connected to database');
    //starting app
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
      });
    //connect to sheets
})
.catch((error)=>{
    console.log(error)
})






