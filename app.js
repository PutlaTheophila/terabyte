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

dotenv.config();


app.use(express.json());

app.use(cors({
    origin:'https://terabyte-vw3n.onrender.com',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
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
        secure: false, // Secure should be false for local development (no HTTPS)
        httpOnly: true, // Ensures cookie is not accessible via JavaScript
        sameSite: 'None' 
    }
}));

app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/api/v1/news',newsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user',userRoute);
// app.use('/api/v1/attendance/nso', nsoAttendanceRouter);
app.use('/api/v1/player', playerRouter);
app.use('/api/v1/attendance/interiit', interiitAttendanceRouter);
app.use('/api/v1/tournaments' ,tournamentsRouter)


app.get('/' , (req ,res)=>{
    res.status(200).send('hello');
})

app.get ('/api/v1/auth/google' , passport.authenticate('google',{scope:['profile' ,'email']}))
app.get('/api/v1/auth/google/callback', passport.authenticate('google' , {
    failureRedirect:"https://terabyte-vw3n.onrender.com/",
    successRedirect:"https://terabyte-vw3n.onrender.com/nso"
    

}) , (req ,res)=>{
    res.status(200).json('thank you for signing in')
})


app.use(errorHandler);
export default app;