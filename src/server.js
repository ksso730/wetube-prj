import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import session from "express-session"
import { localsMiddleware } from "./middlewares";
import MongoStore from "connect-mongo";
import apiRouter from "./routers/apiRouter";
import flash from "express-flash";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session 미들웨어가 서버에 text를 보낸다.
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({mongoUrl: process.env.DB_URL })
    })
);

// app.use((req, res, next) => {
//     req.sessionStore.all((error, sessions) => {
//         console.log(sessions);
//         next();
//     });
// });

// app.get("/add-one", (req, res, next) => {
//     req.session.potato += 1;
//     return res.send(`${req.session.id} ${req.session.potato}`);
// });

// messages.locals 를 만들어 준다.
app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
// asset 폴더 안을 열람할수 있게 해주세요 url: /static, dir: assets (둘다 같은이름일 필요는 없음)
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;