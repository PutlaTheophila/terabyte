import express from "express"
const interiitAttendanceRouter = express.Router();
import { findCoordinatorType, getPlayerForViewAttendance, getPlayersForAttendance, getPlayerAttendance, postAttendance, stats } from "../controllers/interiitAttendanceController.js"
import { sportAttendance } from "../controllers/interiitAttendanceController.js";
import {verifyIdToken} from "../mw.js"

interiitAttendanceRouter.route('/:sport')
    .post(verifyIdToken,postAttendance)
    .get(verifyIdToken,getPlayerAttendance)

interiitAttendanceRouter.route('/players/:sport')
    .get(verifyIdToken,getPlayersForAttendance)

interiitAttendanceRouter.route('/stats/:type/:sport')
    .get(verifyIdToken,stats)


interiitAttendanceRouter.route('/mark-attendance-navbar')
    .get(verifyIdToken,findCoordinatorType)

interiitAttendanceRouter.route('/player')
    .get(verifyIdToken,getPlayerForViewAttendance);

export default interiitAttendanceRouter;