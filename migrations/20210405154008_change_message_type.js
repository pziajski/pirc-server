exports.up = function (knex) {
    return knex.schema.alterTable("Chats", table => {
        table.longtext("message").alter();
    })
};

exports.down = function (knex) {
    return knex.schema.alterTable("Chats", table => {
        table.string("message").alter();
    })
};
