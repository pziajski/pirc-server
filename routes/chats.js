const express = require("express");
const Chats = require("../models/chats");
const Users = require("../models/users");
const router = express.Router();
const { encryptData, decryptData, encryptValue, decryptValue, encryptResponse } = require("../functions/encryption");

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
                        username: decryptValue(username),
                        message: decryptValue(message),
                        created_at: created_at
                    }
                });
                encryptResponse(res, 200, messages);
            })
            .catch(error => {
                console.error("...ERROR... Chats GET all messages =>", error);
                encryptResponse(res, 404, { success: false, message: "channel does not exist" });
            })
    })
    .post((req, res) => {
        const { user_id, message } = decryptData(req.body.data);
        new Chats({
            user_id: user_id,
            channel_id: req.params.channelID,
            created_at: new Date(),
            message: encryptValue(message)
        })
            .save()
            .then(newComment => {
                const { created_at, message } = newComment.attributes;
                Users
                    .where("id", newComment.attributes.user_id)
                    .fetch()
                    .then(user => {
                        const username = decryptValue(user.attributes.username);
                        const comment = {
                            username,
                            message: decryptValue(message),
                            created_at: created_at
                        }
                        encryptResponse(res, 200, comment);
                    })
            })
            .catch(error => {
                console.error("...ERROR... Chats POST new comment =>", error);
                encryptResponse(res, 404, { success: false, message: "could not create comment" });
            })
    })

module.exports = router;