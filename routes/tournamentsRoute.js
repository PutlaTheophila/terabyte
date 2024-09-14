import express from "express";
const tournamentsRouter = express.Router();
import { createTournament ,getAllTournaments ,getTournament ,updateTournament } from "../controllers/tournamentsController.js";

tournamentsRouter.route('/')
    .get(getAllTournaments)
    .post(createTournament)
tournamentsRouter.route('/:id')
    .patch(updateTournament)
    .get(getTournament)

export default tournamentsRouter;