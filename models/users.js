const bookshelf = require("../bookshelf");

const Users = bookshelf.model("Users", {
    tableName: "Users"
});

module.exports = Users;