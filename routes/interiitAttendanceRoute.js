import express from "express"
const interiitAttendanceRouter = express.Router();
import { personalAttendance, postAttendance, stats } from "../controllers/interiitAttendanceController.js"
import { sportAttendance } from "../controllers/interiitAttendanceController.js";
import {verifyIdToken} from "../mw.js"

interiitAttendanceRouter.route('/')
    .post(verifyIdToken,postAttendance)
    .get(verifyIdToken,personalAttendance)
interiitAttendanceRouter.route('/sportattendance')
    .get(verifyIdToken,sportAttendance)
interiitAttendanceRouter.route('/stats/:type/:sport')
    .get(verifyIdToken,stats)

export default interiitAttendanceRouter;