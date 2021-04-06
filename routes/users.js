const express = require("express");
const Users = require("../models/users");
const Joined = require("../models/joined");
const router = express.Router();
const { encryptData, decryptValue, encryptResponse } = require("../functions/encryption");

router
    .route("/")
    .get((req, res) => {
        Users
            .fetchAll()
            .then(users => {
                encryptResponse(res, 200, users);
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
                encryptResponse(res, 200, userInfo);
            })
            .catch(error => {
                console.error("...ERROR... Users GET certain user ->", error);
                encryptResponse(res, 400, { success: false, message: "user not found" });
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
                        encryptResponse(res, 200, channelsJoined);
                    })
                    .catch(error => {
                        console.error("...Error... Users GET channels joined ->", error);
                        encryptResponse(res, 404, { success: false, message: "could not find user's joined channels" });
                    })
            })

    })

module.exports = router;