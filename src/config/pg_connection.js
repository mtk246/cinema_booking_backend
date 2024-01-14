const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: "cinema",
    host: "localhost",
    database: "cinema",
    password: "cinema",
    port: "5600",
});

const query = (sql, values) => {
    const pool = new Pool({
        user: "cinema",
        host: "localhost",
        database: "cinema",
        password: "cinema",
        port: "5600",
    });

    return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });
};

exports.pool = pool;
exports.query = query;
