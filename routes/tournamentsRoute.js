import express from "express";
const tournamentsRouter = express.Router();
import { createTournament ,getAllTournaments ,getTournament ,updateTournament } from "../controllers/tournamentsController.js";
import { getGoogleData } from "../controllers/authController.js";

tournamentsRouter.route('/')
    .get(getAllTournaments)
    .post(createTournament)
tournamentsRouter.route('/:id')
    .patch(updateTournament)
    .get(getTournament)
tournamentsRouter.route('/auth')
    .post(getGoogleData)

export default tournamentsRouter;