const express = require("express");
const Chats = require("../models/chats");
const Users = require("../models/users");
const router = express.Router();
const { encryptData, decryptData } = require("../functions/encryption");

router
    .route("/:channelID")
    .get((req, res) => {
        Chats
            .where("channel_id", req.params.channelID)
            .fetchAll({ withRelated: ["user"] })
            .then(chats => {
                let messages = chats.models.map(item => {
                    const { created_at, message  } = item.attributes;
                    const { username } = item.relations.user.attributes;
                    return {
                        username,
                        message,
                        created_at
                    }
                });
                res.status(200).json(encryptData(messages));
            })
            .catch(error => {
                console.error("...ERROR... Chats GET all messages =>", error);
                res.status(404).json(encryptData({ success: false, message: "channel does not exist" }));
            })
    })
    .post((req, res) => {
        const { user_id, message } = decryptData(req.body.data);
        new Chats({
            user_id,
            channel_id: req.params.channelID,
            created_at: new Date(),
            message
        })
            .save()
            .then(newComment => {
                const { created_at, message } = newComment.attributes;
                Users
                    .where("id", newComment.attributes.user_id)
                    .fetch()
                    .then(user => {
                        const { username } = user.attributes;
                        const comment = {
                            username,
                            message,
                            created_at
                        }
                        res.status(200).json(encryptData(comment));
                    })
            })
            .catch(error => {
                console.error("...ERROR... Chats POST new comment =>", error);
                res.status(404).json(encryptData({ success: false, message: "could not create comment" }));
            })
    })

module.exports = router;