import express from "express";
import morgan from "morgan";

// *express application생성
const app = express();

// middleware
const logger = morgan("dev");

const privateMiddlewr = (req, res, next) => {
    const url = req.url;
    if(url==="/protected"){
        return res.send("<h1>Not Allowed</h1>")
    }
    console.log("allowed, you may continue.");
    next();
};


// *요청기능
const handleEvnt = (req, res) => {
    console.log("handleEvnt here");
    return res.send("<h1>Home</h1>");
};

const handleProtected = (req, res) => {
    return res.send("This site is private.")
};

app.use(logger);
app.use(privateMiddlewr);
app.get("/", handleEvnt);
app.get("/protected", handleProtected);

// *외부서버 연결
const PORT = 4001
// callback 함수? 서버가 시작할때 작동하는 함수
// port정보를 줘야함.
const handleListening = () =>
console.log(`✅ Server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
