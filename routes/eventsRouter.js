import express from "express";
import { deleteEvent, getAllEvents, postEvent,getEvent } from "../controllers/eventsController.js";
const eventsRouter = express.Router();

eventsRouter.route('/')
    .get(getAllEvents)
    .post(postEvent)
    .delete(deleteEvent)
eventsRouter.route('/:id')
    .delete(deleteEvent)
    .get(getEvent)

export default eventsRouter;