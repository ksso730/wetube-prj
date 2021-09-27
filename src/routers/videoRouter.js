import express from "express";
import { 
    getEdit, postEdit, watch, getUpload, postUpload
} from "../contorllers/videoController";

const videoRouter = express.Router();

// upload 를 2번째로 내리면, request는 가장 위에서부터 요청을 처리하기 때문에 upload가 id라고 인식한다.
// 하지만 가장 상단으로 올려주면 정상적으로 작동한다.
videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);

export default videoRouter;