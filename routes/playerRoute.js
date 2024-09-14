import express from "express"
const playerRouter = express.Router();
import { createPlayer, getAllPlayers, getPlayer, updatePlayer } from "../controllers/playerController.js";

playerRouter.route('/')
    .post(createPlayer)
    .get(getPlayer)
    .patch(updatePlayer)
playerRouter.route('/:id')
    .get(getAllPlayers)
export default playerRouter;