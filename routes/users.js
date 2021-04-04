const express = require("express");
const Users = require("../models/users");
const Joined = require("../models/joined");
const router = express.Router();

router
    .route("/")
    .get((req, res) => {
        Users
            .fetchAll()
            .then(users => {
                res.status(200).json(users);
            });
    });

router
    .route("/userInfo")
    .get((req, res) => {
        Users
            .where("username", req.body.username)
            .fetch()
            .then(user => {
                const userInfo = {
                    id: user.attributes.id,
                    username: user.attributes.username
                }
                res.status(200).json(userInfo);
            })
            .catch(error => {
                console.error("...ERROR... Users GET certain user ->", error);
                res.status(400).send("User not found");
            })
    })

router
    .route("/channels")
    .get((req, res) => {
        Users
            .where("username", req.body.username)
            .fetch()
            .then(user => {
                Joined
                    .where("user_id", user.attributes.id)
                    .fetchAll({ withRelated: ["channel"] })
                    .then(channelsJoined => {
                        res.status(200).json(channelsJoined);
                    })
                    .catch(error => {
                        console.error("...Error... Users GET channels joined ->", error);
                        res.status(404).send("Could not find user's joined channels.");
                    })
            })

    })

module.exports = router;