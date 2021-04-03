exports.up = function (knex) {
    return knex.schema.table("Users", table => {
        table.string("password").notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.table("Users", table => {
        table.dropColumn("password");
    });
};
