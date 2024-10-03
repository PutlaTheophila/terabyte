import express from "express";
import {findUser, logoutUser , findCoordinator, getGoogleData} from "../controllers/authController.js"
const authRouter = express.Router();

authRouter.route('/')
    .post(getGoogleData)
    .delete(logoutUser)
authRouter.route('/coordinator')
    .get(findCoordinator)
authRouter.route('/google/callback')
    .post(getGoogleData)
export default authRouter;