exports.up = function(knex) {
    return knex.schema.createTable("Channels", table => {
        table.increments("id").unsigned().primary();
        table.string("name").notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("Channels");
};
