export const trending = (req, res) => res.send("🏠 HomePage Stories");
export const newStory = (req, res) => res.send("💝 New Story");

export const edit = (req, res) => {
    res.send(`✏️ Edit story ${req.params.id}`);
};
export const deleteStory = (req, res) =>{
    res.send(`✂️ Delete story ${req.params.id}`);
};
export const see = (req, res) => {
    res.send(`Let's see 📖${req.params.id}`);
};