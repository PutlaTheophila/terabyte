import express from "express";
import { getGoogleData, isUserLoggedIn} from "../controllers/authController.js"
import {verifyIdToken} from "../mw.js"
const authRouter = express.Router();

authRouter.route('/')
    .get(verifyIdToken,isUserLoggedIn)
    .post()

authRouter.route('/google/callback')
    .post(getGoogleData)
export default authRouter;