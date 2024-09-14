import express from "express";
import {findUser, logoutUser , findCoordinator} from "../controllers/authController.js"
const authRouter = express.Router();

authRouter.route('/')
    .get(findUser)
    .delete(logoutUser)
authRouter.route('/coordinator')
    .get(findCoordinator)

export default authRouter;