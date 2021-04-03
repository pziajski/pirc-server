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
                res.status(200).json(user);
            })
            .catch(error => {
                console.error("...ERROR... Users GET certain user ->", error);
                res.status(400).send("User not found");
            })
    })

router
    .route("/:id/channels")
    .get((req, res) => {
        Joined
            .where("user_id", req.params.id)
            .fetchAll({ withRelated: ["channel"] })
            .then(channelsJoined => {
                res.status(200).json(channelsJoined);
            })
            .catch(error => {
                console.error("...Error... Users GET channels joined ->", error);
                res.status(404).send("Could not find user's joined channels.");
            })
    })

module.exports = router;