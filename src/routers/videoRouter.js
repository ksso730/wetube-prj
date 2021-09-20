import express from "express";
import { edit, see, deleteVideo, upload} from "../contorllers/videoController";

const videoRouter = express.Router();

// upload 를 2번째로 내리면, request는 가장 위에서부터 요청을 처리하기 때문에 upload가 id라고 인식한다.
// 하지만 가장 상단으로 올려주면 정상적으로 작동한다.
videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;