import Coordinator from "../models/coordinator.js";
import asyncErrorHandler from "../utils/async-error-handler.js";

export const createCoordinator = asyncErrorHandler(async(req,res)=>{
    const data = req.body;
    const coordinators = await Coordinator.create(data);
    res.status(200).json({
        status:'success',
        coordinators
    })
})

export const deleteCoordinator = asyncErrorHandler(async(req,res)=>{
    const id = req.params.id;
    const coordinators = await Coordinator.findByIdAndDelete(data);
    res.status(200).json({
        status:'success',
        coordinators
    })
})


export const updateCoordinator = asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    const coordinators = await Coordinator.findByIdAndUpdate(id, data, {
        new: true, // Returns the updated document
        runValidators: true // Runs schema validators on the update operation
    });

    if (!coordinators) {
        return res.status(404).json({
            status: 'fail',
            message: 'Coordinator not found'
        });
    }

    res.status(200).json({
        status: 'success',
        coordinators
    });
});


export const getAllCoordinators = asyncErrorHandler(async(req,res)=>{
    const data = await Coordinator.find({});
    res.status(200).json({
        status:'success',
        data
    })
})


export const getCoordinators = asyncErrorHandler(async(req,res)=>{
    const id = req.params.id;
    const data = await Coordinator.findById({_id:id});
    res.status(200).json({
        status:'success',
        data
    })
})
