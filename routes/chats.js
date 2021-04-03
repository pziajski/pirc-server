const express = require("express");
const Chats = require("../models/chats");
const router = express.Router();

router
    .route("/:channelID")
    .get((req, res) => {
        Chats
            .where("channel_id", req.params.channelID)
            .fetchAll({ withRelated: ["user"] })
            .then(chats => {
                res.status(200).json(chats);
            })
            .catch(error => {
                console.error("...ERROR... Chats GET all messages =>", error);
                res.status(404).send("Channel doesnt exist.");
            })
    })
    .post((req, res) => {
        new Chats({
            user_id: req.body.user_id,
            channel_id: req.params.channelID,
            created_at: new Date(),
            message: req.body.message
        })
            .save()
            .then(newComment => {
                res.status(200).json(newComment);
            })
            .catch(error => {
                console.error("...ERROR... Chats POST new comment =>", error);
                res.status(404).send("Could not post comment.");
            })
    })

module.exports = router;