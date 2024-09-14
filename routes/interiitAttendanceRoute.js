import express from "express"
const interiitAttendanceRouter = express.Router();
import { personalAttendance, postAttendance, stats } from "../controllers/interiitAttendanceController.js"
import { sportAttendance } from "../controllers/interiitAttendanceController.js";

interiitAttendanceRouter.route('/')
    .post(postAttendance)
    .get(personalAttendance)
interiitAttendanceRouter.route('/sportattendance')
    .get(sportAttendance)
interiitAttendanceRouter.route('/stats/:type/:sport')
    .get(stats)

export default interiitAttendanceRouter;