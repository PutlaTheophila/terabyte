import express from "express"
const nsoAttendanceRouter = express.Router();
import { getPlayersForAttendance, getSheetsData } from "../controllers/nsoAttendanceController.js";


nsoAttendanceRouter.route('/players')
    .get(getPlayersForAttendance)


export default nsoAttendanceRouter;