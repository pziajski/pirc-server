const express = require("express");
const Channels = require("../models/channels");
const Joined = require("../models/joined");
const Users = require("../models/users");
const router = express.Router();

router
    .route("/")
    .get((req, res) => {
        Channels
            .fetchAll()
            .then(channels => {
                res.status(200).json(channels);
            });
    })
    .post((req, res) => {
        new Channels({
            name: req.body.name
        })
            .save()
            .then(newChannel => {
                Users
                    .where("username", req.body.username)
                    .fetch()
                    .then(user => {
                        new Joined({
                            user_id: user.attributes.id,
                            channel_id: newChannel.attributes.id
                        })
                            .save()
                            .then(() => {
                                res.status(201).json(newChannel);
                            })
                    })
            })
            .catch(() => {
                console.error("...ERROR... Channels POST create new channel =>", error);
                res.status(404).send("Could not create channel");
            });
    });

router
    .route("/:id")
    .get((req, res) => {
        Channels
            .where("id", req.params.id)
            .fetch()
            .then(channelData => {
                res.status(200).json(channelData);
            })
            .catch((error) => {
                console.error("...ERROR... Channels GET channel info =>", error);
                res.status(404).send("Could not create channel");
            });
    })


router
    .route("/:id/users")
    .get((req, res) => {
        Joined
            .where("channel_id", req.params.id)
            .fetchAll()
            .then(users => {
                res.status(200).json(users)
            })
            .catch(error => {
                console.error("...ERROR... Channels GET channel users =>", error);
                res.status(400).send("Channel does not exist.");
            })
    })
    .post((req, res) => {
        new Joined({
            user_id: req.body.user_id,
            channel_id: req.params.id
        })
            .save()
            .then(joinedChannel => {
                res.status(201).json(joinedChannel);
            })
            .catch(error => {
                console.error("...ERROR... Channels POST join channel =>", error);
                res.status(404).send("Could not join channel");
            })
    });

module.exports = router;