const express = require("express");
const Channels = require("../models/channels");
const Joined = require("../models/joined");
const Users = require("../models/users");
const router = express.Router();
const { encryptData, decryptData, encryptResponse } = require("../functions/encryption");

router
    .route("/")
    .get((req, res) => {
        Channels
            .fetchAll()
            .then(channels => {
                encryptResponse(res, 200, channels);
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
                    .where("id", req.body.user_id)
                    .fetch()
                    .then(user => {
                        new Joined({
                            user_id: user.attributes.id,
                            channel_id: newChannel.attributes.id
                        })
                            .save()
                            .then(() => {
                                encryptResponse(res, 201, newChannel);
                            })
                    })
            })
            .catch(() => {
                console.error("...ERROR... Channels POST create new channel =>", error);
                encryptResponse(res, 404, { success: false, message: "could not create channel" });
            });
    });

router
    .route("/:id")
    .get((req, res) => {
        Channels
            .where("id", req.params.id)
            .fetch()
            .then(channelData => {
                encryptResponse(res, 200, channelData);
            })
            .catch((error) => {
                console.error("...ERROR... Channels GET channel info =>", error);
                encryptResponse(res, 404, { success: false, message: "could not get channel info" });
            });
    })


router
    .route("/:id/users")
    .get((req, res) => {
        Joined
            .where("channel_id", req.params.id)
            .fetchAll()
            .then(users => {
                encryptResponse(res, 200, users);
            })
            .catch(error => {
                console.error("...ERROR... Channels GET channel users =>", error);
                encryptResponse(res, 400, { success: false, message: "channel does not exist" });
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
                encryptResponse(res, 201, joinedChannel);
            })
            .catch(error => {
                console.error("...ERROR... Channels POST join channel =>", error);
                encryptResponse(res, 404, { success: false, message: "could not join channel" });
            })
    });

module.exports = router;