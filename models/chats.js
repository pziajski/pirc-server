const bookshelf = require("../bookshelf");

const Chats = bookshelf.model("Chats", {
    tableName: "Chats",
    user: function() {
        return this.belongsTo("Users", "user_id", "id");
    },
    channel: function() {
        return this.belongsTo("Channels", "channel_id", "id");
    }
});

module.exports = Chats;