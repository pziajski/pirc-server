const express = require("express");
const Users = require("../models/users");
const Joined = require("../models/joined");
const router = express.Router();
const { encryptData, decryptValue } = require("../functions/encryption");

router
    .route("/")
    .get((req, res) => {
        Users
            .fetchAll()
            .then(users => {
                res.status(200).json(encryptData(users));
            });
    });

router
    .route("/userInfo")
    .get((req, res) => {
        Users
            .where("id", req.body.user_id)
            .fetch()
            .then(user => {
                const userInfo = {
                    id: user.attributes.id,
                    username: decryptValue(user.attributes.username)
                }
                res.status(200).json(encryptData(userInfo));
            })
            .catch(error => {
                console.error("...ERROR... Users GET certain user ->", error);
                res.status(400).json({ success: false, message: "user not found" });
            })
    })

router
    .route("/channels")
    .get((req, res) => {
        Users
            .where("id", req.body.user_id)
            .fetch()
            .then(user => {
                Joined
                    .where("user_id", user.attributes.id)
                    .fetchAll({ withRelated: ["channel"] })
                    .then(channelsJoined => {
                        res.status(200).json(encryptData(channelsJoined));
                    })
                    .catch(error => {
                        console.error("...Error... Users GET channels joined ->", error);
                        res.status(404).json({ success: false, message: "could not find user's joined channels" });
                    })
            })

    })

module.exports = router;