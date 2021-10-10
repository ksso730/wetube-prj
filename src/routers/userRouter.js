import express from "express";
import { edit, remove, logout, seeProfile, startGithubLogin, finishGithubLogin, getEdit, postEdit, getChangePw, postChangePw } from "../contorllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
    .route("/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    // uploadFiles.single("avatar") => 이 middleware는 사진을 시스템에 저장하고, req.file을 추가한다.
    // type이 file인 
    .post(avatarUpload.single("avatar"), postEdit);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePw).post(postChangePw);
userRouter.get("/remove", remove);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", seeProfile)

export default userRouter;