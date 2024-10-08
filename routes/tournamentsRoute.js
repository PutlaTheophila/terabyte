import express from "express";
const tournamentsRouter = express.Router();
import { createTournament ,getAllTournaments ,getTournament ,updateTournament } from "../controllers/tournamentsController.js";
import { getGoogleData, isUserLoggedIn } from "../controllers/authController.js";
import {verifyIdToken} from "../mw.js"

tournamentsRouter.route('/')
    .get(getAllTournaments)
    .post(createTournament)
tournamentsRouter.route('/:id')
    .patch(updateTournament)
    .get(getTournament)
tournamentsRouter.route('/auth')
    .get(isUserLoggedIn);

export default tournamentsRouter;