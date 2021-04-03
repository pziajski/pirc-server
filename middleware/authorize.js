const jwt = require("jsonwebtoken");
const Users = require("../models/users");

module.exports = (req, res, next) => {
    const token = req.cookies.authToken;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const username = decoded.username;
        Users
            .where("username", username)
            .fetch()
            .then(user => {
                req.body.username = username;
                next();
            })
            .catch(error => {
                throw new Error("User Not found");
            })
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
}