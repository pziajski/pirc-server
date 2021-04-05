const jwt = require("jsonwebtoken");
const Users = require("../models/users");

module.exports = (req, res, next) => {
    const token = req.cookies.authToken;
    console.log("auth token", token)
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.user_id;
        console.log("authorize decoded", decoded)
        Users
            .where("id", user_id)
            .fetch()
            .then(user => {
                console.log("user found", user.attributes)
                req.body.user_id = user.attributes.id;
                next();
            })
            .catch(error => {
                throw new Error("User Not found");
            })
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
}