import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch"


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

export const startGithubLogin = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        client_id: "55a2b23d3ebd9040568a",
        allow_signup: false,
        scope: "read:user user:email"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

// step 2. Users are redirected back to your site by GitHub
export const finishGithubLogin = async(req, res)=> {
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
            method:"POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    // res.send(JSON.stringify(json));
    // {"access_token":"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","token_type":"bearer","scope":"read:user,user:email"}

    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const userRequest = await (
            await fetch("https://api.github.com/user",{
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })  
        ).json();
        console.log(userRequest);
    }else{
        return res.redirect("/login");
    }

    //step3. Your app accesses the API with the user's access token
};


