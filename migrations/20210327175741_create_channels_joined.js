exports.up = function (knex) {
    return knex.schema.createTable("Channels Joined", table => {
        table.increments("id").unsigned().primary();
        table.integer("user_id").unsigned().references("id").inTable("Users").onDelete("CASCADE");
        table.integer("channel_id").unsigned().references("id").inTable("Channels").onDelete("CASCADE");
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable("Channels Joined");
};
