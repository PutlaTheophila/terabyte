import express from "express";
import {findUser, logoutUser , findCoordinator, getGoogleData, isUserLoggedIn} from "../controllers/authController.js"
const authRouter = express.Router();

authRouter.route('/')
    .post(isUserLoggedIn)

authRouter.route('/google/callback')
    .post(getGoogleData)
export default authRouter;