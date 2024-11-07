import express from "express"
const nsoAttendanceRouter = express.Router();
import { getPlayersForAttendance, getSheetsData } from "../controllers/nsoAttendanceController.js";
import {verifyIdToken} from "../mw.js"

nsoAttendanceRouter.route('/players/:sport')
    .get(verifyIdToken,getPlayersForAttendance)


export default nsoAttendanceRouter;