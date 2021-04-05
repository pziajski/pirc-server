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
const { decryptData, encryptData, decryptValue, encryptValue } = require("./functions/encryption");

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
        .fetchAll()
        .then(users => {
            const user = users.models.find(model => decryptValue(model.attributes.username) === username);
            if (decryptValue(user.attributes.password) === String(password)) {
                const user_id = user.attributes.id;
                let token = jwt.sign({ username, user_id }, process.env.JWT_SECRET);
                console.log("login user", user_id)
                res.status(200).json(encryptData({ success: true, message: "success", token }));
            } else {
                throw new Error("failed login.");
            }
        })
        .catch(error => {
            res.status(401).json({ success: false, message: "incorrect username or password" });
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
                res.status(400).json({ success: false, message: "username is already in use" })
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
                            console.log("signed up user", decrypUsername, user_id);
                            res.status(200).json(encryptData({ success: true, message: "success", token }));

                        })
                        .catch((error) => {
                            console.error("...Error... Signup POST create user ->", error);
                            res.status(404).json({ success: false, message: "could not join channel" });
                        });
                })
                .catch((error) => {
                    console.error("...Error... Signup POST create user ->", error);
                    res.status(404).json({ success: false, message: "could not create user" });
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