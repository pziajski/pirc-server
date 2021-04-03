exports.up = function(knex) {
    return knex.schema.createTable("Chats", table => {
        table.increments("id").unsigned().primary();
        table.integer("user_id").unsigned().references("id").inTable("Users").onDelete("CASCADE");
        table.integer("channel_id").unsigned().references("id").inTable("Channels").onDelete("CASCADE");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.string("message").notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("Chats");
};
