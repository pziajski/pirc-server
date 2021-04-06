// imports
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const usersRoute = require("./routes/users");
const channelsRoute = require("./routes/channels");
const chatsRoute = require("./routes/chats");
const Users = require("./models/users");
const Joined = require("./models/joined");
const authorize = require("./middleware/authorize");
const { decryptData, encryptData, decryptValue, encryptValue, encryptResponse } = require("./functions/encryption");

// variables
const PORT = process.env.PORT;
const app = express();

// middleware
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: process.env.NODE_ENV === "production" ? "https://pirc.netlify.app" : true,
    methods: [ "GET", "POST" ],
    allowedHeaders: ['Access-Control-Allow-Headers', 'https://pirc.netlify.app']
}));
app.use(cookieParser());

// enpoints / routes
app.post("/login", (req, res) => {
    const data = decryptData(req.body.data);
    let username = data.username;
    let password = data.password;
    Users
        .fetchAll()
        .then(users => {
            const user = users.models.find(model => decryptValue(model.attributes.username) === username);
            if (decryptValue(user.attributes.password) === password) {
                const user_id = user.attributes.id;
                let token = jwt.sign({ username, user_id }, process.env.JWT_SECRET);
                encryptResponse(res, 200, { success: true, message: "user logged in", token });
            } else {
                throw new Error("failed login.");
            }
        })
        .catch(error => {
            encryptResponse(res, 401, { success: false, message: "incorrect username or password" });
        })
});

app.post("/signup", (req, res) => {
    const data = decryptData(req.body.data);
    const username = data.username;
    const password = data.password;
    Users
        .fetchAll()
        .then(users => {
            const user = users.models.find(model => decryptValue(model.attributes.username) === username);
            if (!!user) {
                encryptResponse(res, 400, { success: false, message: "username is already in use" });
            } else {
                throw new Error("user not found");
            }
        })
        .catch(() => {
            new Users({
                username: encryptValue(username),
                password: encryptValue(password)
            })
                .save()
                .then(newUser => {
                    const user_id = newUser.attributes.id;
                    const decrypUsername = decryptValue(newUser.attributes.username);
                    let token = jwt.sign({ username: decrypUsername, user_id }, process.env.JWT_SECRET);
                    new Joined({
                        user_id: newUser.attributes.id,
                        channel_id: 1
                    })
                        .save()
                        .then(() => {
                            encryptResponse(res, 200, { success: true, message: "success", token });

                        })
                        .catch((error) => {
                            console.error("...Error... Signup POST create user ->", error);
                            encryptResponse(res, 404, { success: false, message: "could not join channel" });
                        });
                })
                .catch((error) => {
                    console.error("...Error... Signup POST create user ->", error);
                    encryptResponse(res, 404, { success: false, message: "could not create user" });
                })
        })
});

app.use(authorize);
app.use("/users", usersRoute);
app.use("/channels", channelsRoute);
app.use("/chats", chatsRoute);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})