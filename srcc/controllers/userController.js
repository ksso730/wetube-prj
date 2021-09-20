
export const home = (req, res) => res.send("😶 Home User");
export const join = (req, res) => res.send("🤩 Join User");
export const login = (req, res) => res.send("😊 Login User");
export const edit = (req, res) => res.send("🤨 Edit User");
export const see = (req, res) => {
    res.send(`Hello #${req.params.id}`);
};
