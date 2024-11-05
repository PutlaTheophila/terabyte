import asyncErrorHandler from "../utils/async-error-handler.js";
import Event from "../models/eventsModel.js";

// export const postEvent = asyncErrorHandler(async(req,res)=>{
//     const data = req.body;
//     const event = await Event.create(data);
//     res.status(200).json({
//         status:'success',
//         event
//     })
// })


export const postEvent = asyncErrorHandler(async (req, res) => {
    const eventsData = req.body.events; // Expecting an array of event objects in req.body

    // Check if the request body has events array
    if (!Array.isArray(eventsData) || eventsData.length === 0) {
        return res.status(400).json({
            status: 'fail',
            message: 'No events provided or events data is not in an array format'
        });
    }

    try {
        // Insert the array of events in bulk
        const events = await Event.insertMany(eventsData);
        res.status(200).json({
            status: 'success',
            events // Array of inserted events
        });
    } catch (error) {
        // Handle any errors in case of validation or insertion issues
        console.error('Error inserting events:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error inserting events. Please check the data format and try again.',
            error: error.message
        });
    }
});


// export const deleteEvent = asyncErrorHandler(async(req,res)=>{
//     const id = req.params.id;
//     const event = await Event.findByIdAndDelete(id);
//     res.status(200).json({
//         status:'success',
//         event
//     })
// })

export const deleteEvent = asyncErrorHandler(async (req, res, next) => {
    const result = await Event.deleteMany({}); // Delete all documents in the Event collection

    if (result.deletedCount === 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'No events found to delete',
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'All events deleted successfully',
        deletedCount: result.deletedCount, // Optional: Number of documents deleted
    });
});


export const getAllEvents = asyncErrorHandler(async(req,res)=>{
    const events = await Event.find({});
    res.status(200).json({
        status:'success',
        nbHits:events.length,
        events
    })

})

export const getEvent = asyncErrorHandler(async(req,res)=>{
    const id = req.params.id;
    const event  = await Event.findById(id);
    res.status(200).json({
        status:'success',
        event
    })

})