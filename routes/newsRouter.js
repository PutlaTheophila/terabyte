import express from "express"
const newsRouter = express.Router();
import { createPost , getAllNews } from '../controllers/newsController.js';


newsRouter.route('/')
    .post(createPost)
    .get(getAllNews)

export default newsRouter;