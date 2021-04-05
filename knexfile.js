// imports
require('dotenv').config();

// variables
const { SQL_DB_HOST, SQL_DB_USER, SQL_DB_PASSWORD, SQL_DB_NAME } = process.env;

module.exports = {
    development: {
        client: 'mysql',
        connection: {
            host: SQL_DB_HOST,
            user: SQL_DB_USER,
            password: SQL_DB_PASSWORD,
            database: SQL_DB_NAME,
            charset: 'utf8'
        }
    },
    production: {
        client: "mysql",
        connection: process.env.JAWSDB_MARIA_URL
    }
}