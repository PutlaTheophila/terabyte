import express from "express";
import { deleteEvent, getAllEvents, postEvent } from "../controllers/eventsController.js";
const eventsRouter = express.Router();

eventsRouter.route('/')
    .get(getAllEvents)
    .post(postEvent)
eventsRouter.route('/:id')
    .delete(deleteEvent)

export default eventsRouter;