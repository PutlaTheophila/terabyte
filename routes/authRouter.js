import express from "express";
import { getGoogleData, isUserLoggedIn} from "../controllers/authController.js"
const authRouter = express.Router();

authRouter.route('/')
    .get(isUserLoggedIn)

authRouter.route('/google/callback')
    .post(getGoogleData)
export default authRouter;