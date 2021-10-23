import express from "express";
import {
    getEdit,
    postEdit,
    watch,
    getUpload,
    postUpload,
    deleteVideo,
    getThumnail,
} from "../contorllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

// upload 를 2번째로 내리면, request는 가장 위에서부터 요청을 처리하기 때문에 upload가 id라고 인식한다.
// 하지만 가장 상단으로 올려주면 정상적으로 작동한다.

videoRouter.post("/thumbnails", getThumnail);
videoRouter
    .get("/upload", getUpload);
    // .route("/upload")
    // .all(protectorMiddleware)
    // .get(getUpload)
    // .post(videoUpload.single("video"), postUpload);
videoRouter.post("/upload", videoUpload.single("video"), postUpload);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);

export default videoRouter;