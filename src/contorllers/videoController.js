
const fakeUser = {
    username : "suyeon",
    loggedIn: true
}

export const trending = (req, res) => {
    const videos = [
        {
            title: "First Video",
            rating: 5,
            comment: 2,
            createdAt: "2 minutes ago",
            views: 14,
            id: 1,
        },
        {
            title: "Second Video",
            rating: 5,
            comment: 21,
            createdAt: "21 minutes ago",
            views: 10,
            id: 2,
        },
        {
            title: "Third Video",
            rating: 52,
            comment: 44,
            createdAt: "52 minutes ago",
            views: 11,
            id: 3,
        },
    ];
    return res.render("home", {pageTitle: "Home", fakeUser: fakeUser, videos});
}

export const see = (req, res) => res.render("watch", {pageTitle: "Watch"});

export const edit = (req, res) => res.render("edit", {pageTitle: "Edit"});
    
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => {
    console.log(req.params);
    res.send("Delete Video");
};