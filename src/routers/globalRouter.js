import express from "express";
import {join, login} from "../contorllers/userController";
import {trending, search} from "../contorllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter;