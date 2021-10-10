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
export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile"});
}


export const postEdit = async(req, res) => {
    const { 
        session: {
            user:{ 
                _id,
             }
        },
        body: { name, email, username, location},
        // !이미 있는 데이터라면? 업데이트 할 수없도록 해야한다. (숙제)
    } = req;

    const updatedUser = await User.findByIdAndUpdate( 
        _id, 
        {
            name, email, username, location
        },
        // new: true이면 업데이트 된 데이터를 가져온다. false이면 이전의 데이터.
        { new: true }
    );
    // user 데이터는 업데이트 되었지만, session도 업데이트 해줘야한다.
    const exists = await User.exists({ $or: [{ username }, { email }] });
    req.session.user = updatedUser;

    // 방법1 session update 
    // req.session.user = {
    //     // ...란 밖으로 꺼낸다는 의미. 업데이트하는 것 이외의 데이터는 이미 존재하는것들을 가져와서 넣어준다.
    //     ...req.session.user,
    //     name, email, username, location
    // }
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
    // session에 정보 추가
    req.session.user = user;

    return res.redirect("/");
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getChangePw = (req, res) => {
    if(req.session.user.socialOnly == true){
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

export const see = (req, res) => res.send("See User");

export const startGithubLogin = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email"
            //  read:user	Grants access to read a user's profile data.
            //  user:email	Grants read access to a user's email addresses.
            //  user:follow	Grants access to follow or unfollow other users.
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
    // 인증이 완료되면 OAuth applicasdtion settings에 설정한 Authorization callback URL로 이동
    // URL: users/github/finish
};

// step 2. Users are redirected back to your site by GitHub
// >> users/github/finish
export const finishGithubLogin = async(req, res) => {
    // access_token 얻기
    const baseUrl = `https://github.com/login/oauth/access_token`;
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    console.log(finalUrl);
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    // = res.send(JSON.stringify(json));
    // result : {"access_token":"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",
    //           "token_type":"bearer","scope":"read:user,user:email"}

    // access_token 으로 user정보를 가져온다.
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

        // 접근권한 증명
        const emailObj = emailData.find(
            (email) => email.primary == true && email.verified == true
        );
        if (!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        // 기존 이용자가 아니면, 비밀번호 없이 새로생성. socialOnly: true
        if (!user) {
            console.log(">>start");
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
        console.log(">>end");
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");  
    } else {
        return res.redirect("/login");
    }
};