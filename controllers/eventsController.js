import asyncErrorHandler from "../utils/async-error-handler.js";
import Event from "../models/eventsModel.js";

export const postEvent = asyncErrorHandler(async(req,res)=>{
    const data = req.body;
    const event = await Event.create(data);
    res.status(200).json({
        status:'success',
        event
    })
})

export const deleteEvent = asyncErrorHandler(async(req,res)=>{
    const id = req.params.id;
    const event = await Event.findByIdAndDelete(id);
    res.status(200).json({
        status:'success',
        event
    })
})

export const getAllEvents = asyncErrorHandler(async(req,res)=>{
    const events = await Event.find({});
    res.status(200).json({
        status:'success',
        nbHits:events.length,
        events
    })

})