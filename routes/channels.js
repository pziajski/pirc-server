const express = require("express");
const Channels = require("../models/channels");
const Joined = require("../models/joined");
const Users = require("../models/users");
const router = express.Router();
const { encryptData, decryptData } = require("../functions/encryption");

router
    .route("/")
    .get((req, res) => {
        Channels
            .fetchAll()
            .then(channels => {
                res.status(200).json(encryptData(channels));
            });
    })
    .post((req, res) => {
        const { name } = decryptData(req.body.data);
        new Channels({
            name
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
                                res.status(201).json(encryptData(newChannel));
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
                res.status(200).json(encryptData(channelData));
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
                res.status(200).json(encryptData(users))
            })
            .catch(error => {
                console.error("...ERROR... Channels GET channel users =>", error);
                res.status(400).send("Channel does not exist.");
            })
    })
    .post((req, res) => {
        const { user_id } = decryptData(req.body.data)
        new Joined({
            user_id,
            channel_id: req.params.id
        })
            .save()
            .then(joinedChannel => {
                res.status(201).json(encryptData(joinedChannel));
            })
            .catch(error => {
                console.error("...ERROR... Channels POST join channel =>", error);
                res.status(404).send("Could not join channel");
            })
    });

module.exports = router;