import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch"
import Video from "../models/Video";
import mongoose from "mongoose";
import { ObjectID } from 'bson';


export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async(req, res) => {
    const { name, username, password, password2, email, location } = req.body;
    const pageTitle = "Join"
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }

    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken."
        });
    }

    try {
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.status(400).render("upload", {
            pageTitle,
            errorMessage: `😓 ${error._message}`
        });
    }
}
export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile"});
}


export const postEdit = async(req, res) => {
    const { 
        session: {
            user:{ 
                _id, avatarUrl
             }
        },
        body: { name, email, username, location},
        file,
    } = req;

    const updatedUser = await User.findByIdAndUpdate( 
        _id, 
        {
            avatarUrl: file? file.path : avatarUrl,
            name, email, username, location
        },
        { new: true }
    );
    const exists = await User.exists({ $or: [{ username }, { email }] });
    req.session.user = updatedUser;

    return res.redirect("/users/edit");
}
export const remove = (req, res) => res.send("Remove User");

export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });

export const postLogin = async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res
            .status(400).render("login", {
                pageTitle: "Login",
                errorMessage: "An account with this username does not exits."
            });
    };
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res
            .status(400).render("login", {
                pageTitle: "Login",
                errorMessage: "Wrong password",
            });
    };
    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getChangePw = (req, res) => {
    if(req.session.user.socialOnly == true){
        req.flash("error", "Can't change password.");
        return res.redirect("/");
    }
    return res.render("change-password", {pageTitle: "Change Password"});
}

export const postChangePw = async(req, res) => {
    const {
        session: {
            user:{ _id }
        },
        body: { oldPw, newPw, newPwConfirm }
    } = req;
    
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPw, user.password);

    if(!ok){
        return res.status(400).render("change-password", {pageTitle: "Change Password", errorMsg: "The current passwork is incorrect."});
    }

    if(newPw!=newPwConfirm){
        return res.status(400).render("change-password", {pageTitle: "Change Password", errorMsg: "The new password does not match the confirmation"});
    } 
    user.password = newPw;
    await user.save();

    return res.redirect("/users/logout");
}

export const seeProfile = async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate("videos");
    
    const videos = await Video.find({owner: ObjectID(id)}).sort({ createdAt: "desc" });
    user.videos = videos;
    if(!user){
        req.flash("error", "Not authorized.");
        return res.status(400).render("404", {pageTitle: "User not found."});
    }

    return res.render("users/profile", {pageTitle: `${user.name}'s SyTube`, user});
}

export const startGithubLogin = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async(req, res) => {
    const baseUrl = `https://github.com/login/oauth/access_token`;
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();

    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com"
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })
        ).json();

        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })
        ).json();

        const emailObj = emailData.find(
            (email) => email.primary == true && email.verified == true
        );
        if (!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");  
    } else {
        return res.redirect("/login");
    }
};
