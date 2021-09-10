import express from "express";

// *express application생성
const app = express();


// middleware??

// request와 response 중간에 있다.
// request - middleware - response

// 모든 handler는 controller 이며 middleware 이다.
// -> next 변수: 
// const handleEvnt = (req, res, next) => { next(); };
const middlewr = (req, res, next) => {
    console.log("middle here");
    next();
};

// *요청기능
const handleEvnt = (req, res) => {
    console.log("handleEvnt here");
    return res.send("<h1>ByeBye</h1>");
};

const handleLogin = (req, res) => {
    return res.send("Login Please");
};

app.get("/", middlewr, handleEvnt);
app.get("/login", handleLogin);

// *외부서버 연결
const PORT = 4001
const handleListening = () =>
    console.log(`✅ Server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
// callback 함수? 서버가 시작할때 작동하는 함수
// port정보를 줘야함.

// HTTP? 가장 안정적이고 오래된 방식. 서버와 통신하는.
// 브라우저가 대신해서 http request 만들어줌