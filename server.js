import mongoose  from 'mongoose';
import app from "./app.js"
export const  port = 5011;
import "dotenv/config";
import dotenv from 'dotenv'
dotenv.config()

mongoose.connect('mongodb+srv://putlat:LjPde0OWQxHLwLrU@cluster0.w4qzg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then((conn)=>{
    console.log('connected to database 2');
    //starting app
    app.listen(process.env.PORT , ()=>{
        console.log(`app is listening on port ${port}`)
    })
    //connect to sheets

})
.catch((error)=>{
    console.log(error)
})






