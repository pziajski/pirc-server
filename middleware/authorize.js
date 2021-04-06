const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const { encryptResponse } = require("../functions/encryption");

module.exports = (req, res, next) => {
    const token = req.cookies.authToken;
    console.log("cookies", req.cookies)
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.user_id;
        Users
            .where("id", user_id)
            .fetch()
            .then(user => {
                req.body.user_id = user.attributes.id;
                next();
            })
            .catch(error => {
                throw new Error("User Not found");
            })
    } catch (error) {
        encryptResponse(res, 401, { success: false, message: error.message });
    }
}