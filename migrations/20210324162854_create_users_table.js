exports.up = function(knex) {
    return knex.schema.createTable("Users", table => {
        table.increments("id").unsigned().primary();
        table.string("username").notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("Users");
};
