const pg = require('pg');
const Pool = pg.Pool;
const pool = new Pool({
    database: 'to-do list', // name of db; this can change!
    host: 'localhost', // where is your db?
    port: 5432, // default for Postgres
    max: 10, // max queries at one time
    idleTimeoutMillis: 30000 // 30 seconds to try to connect, otherwise cancel query
});

// not required but useful for debugging
pool.on('connect', () => {
    console.log('PostgreSQL is connected! Shoutout Node');
});

pool.on('error', (error) => {
    console.log('Error with Postgres pool', error);
})

module.exports = pool;