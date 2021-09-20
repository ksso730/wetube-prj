import express from "express";
import {see, edit, home} from "../controllers/userController"

const userRouter = express.Router();

userRouter.get("/edit-profile", edit);
userRouter.get("/", home);
userRouter.get("/:id(\\d+)", see);

export default userRouter;