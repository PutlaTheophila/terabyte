import mongoose  from 'mongoose';
import app from "./app.js"
// import "dotenv/config";
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT||3008;

mongoose.connect(`mongodb+srv://putlatheophila123:${process.env.MONGODB_SECRET}@cluster0.xy2080g.mongodb.net/cineflex?retryWrites=true&w=majority&appName=Cluster0`)
.then((conn)=>{
    console.log('connected to database');
    //starting app
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
      });
    //connect to sheetss
})
.catch((error)=>{
    console.log(error)
})






