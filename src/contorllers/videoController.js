import { render } from "pug";
import User from "../models/User";
import Video from "../models/Video";

// export const home = async (req, res) => {
//     Video.find({}, (error, videos) => {
//         return res.render("home", {pageTitle: "Home", videos: []});
//     });
// }

export const home = async(req, res) => {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
}

export const watch = async(req, res) => {
    const { id } = req.params;
    // populate("owner") : owner로 포함한 User 정보를 모두 가져온다.
    const video = await Video.findById(id).populate("owner");
    if (!video) {
        return res.render("404", { pageTitle: "Video not found." });
    }
    return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    const {
        user: {_id}
    } = req.session;
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }
    return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

export const postEdit = async(req, res) => {
    const {
        user: {_id}
    } = req.session;
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }

    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }

    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
}

export const postUpload = async(req, res) => {
    const {
        user: {_id},
    } = req.session;
    const { path: fileUrl } = req.file;
    const { title, description, hashtags } = req.body;
    
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags)
        });
        // video를 생성할 때 user의 video object에도 넣어준다.
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
    } catch (error) {
        console.log(error);
        return res.status(400).render("upload", {
            pageTitle: "Upload Video",
            errorMessage: `😓 ${error._message}`
        });
    };
    return res.redirect("/");
};

export const deleteVideo = async(req, res) => {
    const {
        user: {_id}
    } = req.session;

    const video = await Video.findById(_id);
    if(!video){
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }

    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }

    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = async(req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "ig"),
            }
        });
    }
    return res.render("search", { pageTitle: "Search", videos });
};