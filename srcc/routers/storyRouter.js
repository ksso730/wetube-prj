import express from "express";
import { see, edit, deleteStory } from "../controllers/storyController";

const storyRouter = express.Router();

storyRouter.get("/:id", see);
storyRouter.get("/:id/edit", edit);
storyRouter.get("/:id/delete", deleteStory);

export default storyRouter;