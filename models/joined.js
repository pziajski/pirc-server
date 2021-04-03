const bookshelf = require("../bookshelf");

const Joined = bookshelf.model("Channels Joined", {
    tableName: "Channels Joined",
    user: function() {
        return this.belongsTo("Users", "user_id", "id");
    },
    channel: function() {
        return this.belongsTo("Channels", "channel_id", "id");
    }
});

module.exports = Joined;