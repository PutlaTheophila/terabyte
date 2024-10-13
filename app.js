import express from "express"
const app = express();
import newsRouter from "./routes/newsRouter.js";
import authRouter from "./routes/authRouter.js";
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
import coordinatorRoute from "./routes/coordinatorRouter.js";
import eventsRouter from "./routes/eventsRouter.js";

dotenv.config();
app.use(express.json());

app.use(cors({
    origin:'https://iitbhilai-sports.netlify.app',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    allowedHeaders:['Authorization','Content-Type','Custom-Header']
}));
app.options('*', cors());

//;';';'
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//;';';
  
//Routes
app.use('/api/v1/news',newsRouter);
app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/attendance/nso', nsoAttendanceRouterr);
app.use('/api/v1/player', playerRouter);
app.use('/api/v1/attendance/interiit', interiitAttendanceRouter);
app.use('/api/v1/tournaments' ,tournamentsRouter);
app.use('/api/v1/coordinators',coordinatorRoute);
app.use('/api/v1/events',eventsRouter)


app.get('/' , (req ,res)=>{
    res.status(200).send('hello');
})



app.use(errorHandler);
export default app;