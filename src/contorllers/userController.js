import User from "../models/User";
import bcrypt from "bcrypt";
import session from "express-session";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async(req, res) => {
    const { name, username, password, password2, email, location } = req.body;
    const pageTitle = "Join"
    if (password !== password2) {
        // 브라우저에게 url을 기록하지 말라고 알려주는 방법은 status를 직접 알려주는 것이다.
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
export const edit = (req, res) => res.send("Edit User");
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
    // session에 정보 추가
    console.log(user);
    req.session.user = user;

    return res.redirect("/");
};

export const logout = (req, res) => res.send("logout User");
export const see = (req, res) => res.send("See User");