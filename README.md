# PiRC (server code)

PiRC is a standalone or embedded chat client to communicate between two or more parties. It includes custom authentication using JWTs, as well as AES256 encryption on all outgoing data, as well as sensitive data stored inside the database.

## Required

MariaDB is the DB used, but MySQL can be used as well since MariaDB is a fork of it.

## Instalation

install all required packages using `npm i`.

run the database migrations using `npm run migrate` to populate the database with the required tables.

creating a .env file that holds the following
```
PORT=port-of-SQL-database
SQL_DB_USER=SQL-database-user
SQL_DB_PASSWORD=SQL-database-user-password
SQL_DB_HOST=host-of-SQL-server (127.0.0.1 if hosted locally)
SQL_DB_NAME=name-of-database
JWT_SECRET=secret-for-jwt
HASH_KEY=same-hash-key-as-client
```
