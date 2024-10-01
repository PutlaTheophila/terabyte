import express from "express"
const app = express();
import newsRouter from "./routes/newsRouter.js";
import authRouter from "./routes/authRouter.js";
import userRoute from "./routes/usersRoute.js";
// import nsoAttendanceRouter from "./routes/nsoAttendanceRoute.js";
import errorHandler from "./controllers/errorController.js";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./stratergies/google-stratergy.js";
import MongoStore from "connect-mongo";
import playerRouter from "./routes/playerRoute.js";
import interiitAttendanceRouter from "./routes/interiitAttendanceRoute.js";
import tournamentsRouter from "./routes/tournamentsRoute.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config();
app.use(express.json());
// app.use(cookieParser);

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*'); // Or specify allowed origins
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     next();
// });

app.use(cors({
    origin:["https://sss-vld6.onrender.com","https://sports13.netlify.app"],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    allowedHeaders:['Authorization','Content-Type','Custom-Header']
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false, 
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://putlatheophila123:${process.env.MONGODB_SECRET}@cluster0.xy2080g.mongodb.net/cineflex?retryWrites=true&w=majority&appName=Cluster0`,
        collectionName: 'sessions', 
    }),
    cookie: {
        maxAge: 1000 * 1000,
        // secure: true, 
        // sameSite: 'none',
        // httpOnly: true
    }
}));




app.use(passport.initialize());
app.use(passport.session());
//Routes
app.use('/api/v1/news',newsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user',userRoute);
// app.use('/api/v1/attendance/nso', nsoAttendanceRouterr);
app.use('/api/v1/player', playerRouter);
app.use('/api/v1/attendance/interiit', interiitAttendanceRouter);
app.use('/api/v1/tournaments' ,tournamentsRouter)


app.get('/' , (req ,res)=>{
    res.status(200).send('hello');
})

app.get ('/api/v1/auth/google' , passport.authenticate('google',{scope:['profile' ,'email']}))
app.get('/api/v1/auth/google/callback', passport.authenticate('google' , {
    // failureRedirect:"https://sss-vld6.onrender.com",
    // successRedirect:"https://sss-vld6.onrender.com/nso"
    failureRedirect:"https://sports13.netlify.app/",
    successRedirect:"https://sports13.netlify.app/nso"
}) , (req ,res)=>{
    res.status(200).json('thank you for signing in')
})
app.use(errorHandler);
export default app;