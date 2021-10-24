import { render } from "pug";
import { async } from "regenerator-runtime";
import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";
import ffmpeg from "fluent-ffmpeg";
import ObjectId from "bson-objectid"

export const home = async(req, res) => {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
}

export const watch = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");

    if (!video) {
        return res.render("404", { pageTitle: "Video not found." });
    }
    video.comments.reverse();
    return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    const {
        user: {_id}
    } = req.session;
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found.", err: "Video not found." });
    }
    if(String(video.owner) !== String(_id)){
        return res.status(403).redirect("/");
    }
    return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

export const postEdit = async(req, res) => {
    const {
        user: { _id },
      } = req.session;
      const { id } = req.params;
      const { title, description, hashtags } = req.body;
      const video = await Video.findById(id);
      if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found.", err: "Video not found." });
      }
      console.log (String(video.owner)) ;
      console.log (_id);
      if (String(video.owner) !== String(_id)) {
        req.flash("error", "You are not the the owner of the video.");
        return res.status(403).redirect("/");
      }
      await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
      });
      req.flash("success", "Changes saved.");
      return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
}

export const postUpload = async(req, res) => {
    console.log("postUpload"); 
    const {
        user: {_id},
    } = req.session;
    console.log(req.files);
    const { video, thumb } = req.files;
    console.log(video, thumb)
    const { title, description, hashtags } = req.body;
    const isHeroku = process.env.NODE_ENV === "production";
    
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl: isHeroku ? video[0].location : video[0].path,
            thumbUrl: isHeroku ? thumb[0].location : video[0].path,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags)
        });
        
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
        
    } catch (error) {
        console.log(error);
        return res.status(400).render("upload", {
            pageTitle: "Upload Video",
            errorMessage: `😓 ${error._message}`
        });
    };
};
    
export const deleteVideo = async(req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found.", err: "Video not found." });
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
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

export const registerView = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    video.save();
    return res.sendStatus(200);
}

export const createComment = async(req, res) => {
    const {
        session: { user },
        body: { text },
        params: { id },
      } = req;
      const video = await Video.findById(id);
      if (!video) {
        return res.sendStatus(404);
      }
      const comment = await Comment.create({
        text,
        owner: user._id,
        video: id,
      });
      video.comments.push(comment._id);
      video.save();
      return res.status(201).json({ newCommentId: comment._id });
}

export const deleteComment = async(req, res) => {
    const {id} = req.params;
    await Comment.findByIdAndDelete(id);

    return res.status(201).json({ delCommentId: id});
};

export const getThumnail = (req, res) => {
    let thumbUrl = "";
    let fileDuration = "";
    const {fileUrl, fileName} = req.body;

    ffmpeg.ffprobe(fileUrl, function (err, metadata){
        fileDuration = metadata.format.duration;
        if(err){
            console.log(err._message);
        }
    });

    ffmpeg(fileUrl).on('filenames', function(filenames){
        console.log('generate ', filenames.json(","));
        console.log("filenames: ", filenames);
        thumbPath= `uploads/thumbnails/${filenames[0]}`;
    })
    .on("end", function() {
        console.log("Screenshots taken");
        return res.status(201).json({
            thumbUrl,
            fileDuration,
        });
    })
    .on("error", function(err) {
        console.log(err);
        return res.status(500).json({err: err._message});
    })

}