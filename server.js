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
const { decryptData, encryptData } = require("./functions/encryption");

// variables
const PORT = process.env.PORT;
const app = express();

// middleware
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: true
}));
app.use(cookieParser());

// enpoints / routes
app.post("/login", (req, res) => {
    const data = decryptData(req.body.data);
    let username = data.username;
    let password = data.password;
    Users
        .where("username", username)
        .fetch()
        .then(user => {
            if (user.attributes.password === String(password)) {
                let token = jwt.sign({ username: username }, process.env.JWT_SECRET);
                res.cookie("authToken", token, { sameSite: "strict", maxAge: 604800000 }).json(encryptData({ success: true, message: "success" }));
            } else {
                throw new Error("failed login.");
            }
        })
        .catch(error => {
            res.status(401).json(encryptData({ success: false, message: "incorrect username or password" }));
        })
});

app.post("/signup", (req, res) => {
    const data = JSON.parse(decryptData(req.body.data));
    const username = data.username;
    const password = data.password;
    Users
        .where("username", username)
        .fetch()
        .then(user => {
            res.status(400).json(encryptData({ success: false, message: "username is already in use" }));
        })
        .catch(error => {
            new Users({
                username: username,
                password: String(password)
            })
                .save()
                .then(newUser => {
                    let token = jwt.sign({ username: username }, process.env.JWT_SECRET);
                    res.status(200).cookie("authToken", token, { sameSite: "strict", maxAge: 604800000 }).json(encryptData({ success: true, message: "success" }));
                    new Joined({
                        user_id: newUser.attributes.id,
                        channel_id: 1
                    })
                        .save()
                })
                .catch((error) => {
                    console.error("...Error... Signup POST create user ->", error);
                    res.status(404).json(encryptData({ success: false, message: "could not create user" }));
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