import express from "express"
const interiitAttendanceRouter = express.Router();
import { findCoordinatorType, getPlayersForAttendance, personalAttendance, postAttendance, stats } from "../controllers/interiitAttendanceController.js"
import { sportAttendance } from "../controllers/interiitAttendanceController.js";
import {verifyIdToken} from "../mw.js"

interiitAttendanceRouter.route('/')
    .post(verifyIdToken,postAttendance)
    .get(verifyIdToken,personalAttendance)

interiitAttendanceRouter.route('/players/:sport')
    .get(verifyIdToken,getPlayersForAttendance)
    
interiitAttendanceRouter.route('/stats/:type/:sport')
    .get(verifyIdToken,stats)


interiitAttendanceRouter.route('/mark-attendance-navbar')
    .get(verifyIdToken,findCoordinatorType)

export default interiitAttendanceRouter;