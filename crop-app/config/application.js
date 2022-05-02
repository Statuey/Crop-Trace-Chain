import express from "express";
import nunjucks from "nunjucks";
import cookieParser from "cookie-parser";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import routes from "./routes.js";
import config from "./config.js";
import passport from "passport";
import dbPool from "./db.js";
import path, { dirname, basename } from "path";
import { fileURLToPath } from "url";
// 配置 passport
import "./auth.js";

const app = express();
const SessionStore = MySQLStore(session);

// 解析表单数据
app.use(express.urlencoded({ extended: true }));
// 解析 json 数据
app.use(express.json());
// 解析 cookie
app.use(cookieParser());
// session 配置

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: new SessionStore({}, dbPool),
    // cookie: { secure: true },
  })
);

app.use(passport.authenticate("session"));

// 配置模板
const njkEnv = nunjucks.configure("app/views", {
  autoescape: true,
  express: app,
});

njkEnv.addFilter("json", (value) => {
  return JSON.parse(value);
});

// nunjucks 全局变量
app.use((req, res, next) => {
  njkEnv.addGlobal("request", req);
  next();
});

// 静态资源路径
app.use(
  express.static(
    path.join(dirname(fileURLToPath(import.meta.url)), "..", "public")
  )
);

// 用户上传文件
app.use(
  express.static(
    path.join(dirname(fileURLToPath(import.meta.url)), "..", "uploads")
  )
);

// 配置路由
routes(app);

export default app;
