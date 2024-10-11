import express from "express";
import { createCoordinator, deleteCoordinator, getAllCoordinators, getCoordinators, updateCoordinator } from "../controllers/coordinatorController.js";
const coordinatorRoute = express.Router();


coordinatorRoute.route('/')
    .get(getAllCoordinators)
    .post(createCoordinator)
coordinatorRoute.route('/:id')
    .get(getCoordinators)
    .delete(deleteCoordinator)
    .patch(updateCoordinator)

export default coordinatorRoute;