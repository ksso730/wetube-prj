import multer from "multer";
import multerS3 from "multer-s3";

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Wetube";
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    // user가 undefined일때
    res.locals.loggedInUser = req.session.user || {};
    next();
}

//로그인한 유저들에게만 로그아웃 페이지 허용
export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        return next();
    }else{
        req.flash("error", "Not authorized");
        return res.redirect("/login");
    }
}

// 로그인하지 않은 유저들에게 필요한 페이지
export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        return next();
    }else{
        // 로그인 상태에서는 login, join페이지에 접속하지 못한다.
        req.flash("error", "Not authorized");
        return res.redirect("/");
    }
}

export const avatarUpload = multer({
    dest : "uploads/avatars/",
    limits: {
        fileSize: 3000000, //bytes
    },
})

export const videoUpload = multer({
    dest : "uploads/videos/",
    limits: {
        fileSize: 1000000000,
    },
    // storage: isHeroku ? s3VideoUploader : undefined,
})