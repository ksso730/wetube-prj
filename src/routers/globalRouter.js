import express from "express";
import {join, login} from "../contorllers/userController";
import {home} from "../contorllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;