import express from "express";
import {join, login} from "../contorllers/userController";
import {home, search} from "../contorllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter;