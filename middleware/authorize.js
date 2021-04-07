const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const { encryptResponse, decryptValue } = require("../functions/encryption");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.user_id;
        const username = decoded.username;
        Users
            .where("id", user_id)
            .fetch()
            .then(user => {
                if (decryptValue(user.attributes.username) !== username) {
                    throw new Error ("username does not match");
                }
                req.body.user_id = user.attributes.id;
                next();
            })
            .catch(error => {
                throw new Error(error.message);
            })
    } catch (error) {
        encryptResponse(res, 401, { success: false, message: error.message });
    }
}