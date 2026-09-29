import express from "express";
import session from 'express-session';
import passport from 'passport';
import parser from 'body-parser';
import favicon from 'serve-favicon';
const app = express();

import router_index from "./router/index.js";
import router_post from "./router/post.js";
import router_login from "./router/login.js";
import router_write from "./router/write.js";
import router_profile from "./router/profile.js";
import router_feed from "./router/feed/feed.js";
import router_modify from "./router/modify.js";
import router_api_index from "./router/api/index.js";
import router_api_auth from "./router/api/auth.js";
import router_api_delete from "./router/api/delete.js";
import router_api_comment from "./router/api/comment.js";
import router_api_like from "./router/api/like.js";
import router_api_theme from "./router/api/theme.js";
import router_api_upload from "./router/api/upload.js";

import secret from "./config/secret.json" with { type: "json" };

import sendQuery from "./feature/db.js";
import { readFileSync } from "fs";


sendQuery(`SHOW TABLES LIKE 'user'`, []).then((rows) => {
    if(rows.length == 0){
        const sql = readFileSync("./db.sql").toString().split(";");
        while(sql.length > 0){
            if(sql[0].trim() == ""){
                sql.shift();
                continue;
            }
            sendQuery(sql.shift(), []).then(() => {
                console.log("Table created");
            }).catch((err) => {
                console.log("Table creation error");
                console.log(err);
            });
        }
    }
}).catch((err) => {
    console.log("Table check error");
    console.log(err);
});
app.use(favicon('./static/image/favicon.png'));
app.use(parser.json());
app.set("view engine", "ejs");
app.use(express.static("static"));
app.use(session({
    secret: process.env.SESSION_SECRET || secret.session_key,
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", router_index);
app.get("/post/:idx", router_post);
app.get("/write", router_write);
app.post("/write", router_write);
app.get('/login', router_login);
app.get("/logout", router_login);
app.get('/auth/oidc/callback', router_login);
app.get("/profile/:writer", router_profile);
app.post("/profile/:writer", router_profile);
app.get("/feed", router_feed);
app.get("/modify/:idx", router_modify);
app.post("/modify", router_modify);

app.get("/api/index", router_api_index);
app.get("/api/writers", router_api_index);
app.post("/api/auth", router_api_auth);
app.delete("/api/post/:idx", router_api_delete);
app.post("/api/comment", router_api_comment);
app.post("/api/reply", router_api_comment);
app.get("/api/like/:idx", router_api_like);
app.get("/api/theme", router_api_theme);
app.post("/api/upload", router_api_upload);

app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(
        "User-agent: *\nDisallow: /\n"
    );
})

app.get("*", (req, res) => {
    res.status(404);
    res.render("404");
})

app.listen(80, () => {
    console.log("running");
})
