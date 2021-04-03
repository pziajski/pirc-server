const bookshelf = require("../bookshelf");

const Channels = bookshelf.model("Channels", {
    tableName: "Channels"
});

module.exports = Channels;