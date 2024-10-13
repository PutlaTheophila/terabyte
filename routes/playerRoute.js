import express from "express"
const playerRouter = express.Router();
import { addMultiplePlayers, createPlayer, getAllPlayers, getPlayer, updatePlayer ,deletePlayer} from "../controllers/playerController.js";

playerRouter.route('/')
    .post(createPlayer)
    .get(getAllPlayers)
    .patch(updatePlayer)
    .delete(deletePlayer)
playerRouter.route('/:id')
    .get(getPlayer)

playerRouter.route('/add')
    .post(addMultiplePlayers)
export default playerRouter;