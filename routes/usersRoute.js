import express from "express";
const userRoute = express.Router();
import{ deleteUser, getAllUsers, registerUser , updateUser ,getUser } from "../controllers/userController.js"

userRoute.route('/')
    .post(registerUser)
    .get(getUser)
    .patch(updateUser)
userRoute.route('/:id')
    .delete(deleteUser)
    .get(getAllUsers)

export default userRoute;