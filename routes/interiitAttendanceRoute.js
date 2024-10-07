import express from "express"
const interiitAttendanceRouter = express.Router();
import { findCoordinatorType, getPlayerForViewAttendance, getPlayersForAttendance, getPlayerAttendance, postAttendance, stats , getPlayersAttendanceBySport} from "../controllers/interiitAttendanceController.js"
import {verifyIdToken} from "../mw.js"

interiitAttendanceRouter.route('/')
    .post(verifyIdToken,postAttendance)

interiitAttendanceRouter.route('/players/:sport')
    .get(verifyIdToken,getPlayersForAttendance)

interiitAttendanceRouter.route('/get-attendance/:sport')
    .get(verifyIdToken,getPlayerAttendance)

interiitAttendanceRouter.route('/stats/:type/:sport')
    .get(verifyIdToken,stats)


interiitAttendanceRouter.route('/mark-attendance-navbar')
    .get(verifyIdToken,findCoordinatorType)

interiitAttendanceRouter.route('/player')
    .get(verifyIdToken,getPlayerForViewAttendance);

    interiitAttendanceRouter.route('/sportattendance/:sport')
    .get(verifyIdToken,getPlayersAttendanceBySport);


export default interiitAttendanceRouter;