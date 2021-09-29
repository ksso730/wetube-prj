import express from "express";
import {getJoin, postJoin, login} from "../contorllers/userController";
import {home, search} from "../contorllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/login", login);
rootRouter.get("/search", search);

export default rootRouter;