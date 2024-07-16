require("dotenv").config();
const mysql = require('mysql');

const config = {
  connectionLimit: 4,
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
};

const pool = mysql.createPool(config);

const connection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting MySQL connection:', err);
        reject(err);
        return;
      }
      console.log("MySQL pool connected: threadId " + connection.threadId);

      const query = (sql, binding) => {
        return new Promise((resolve, reject) => {
          connection.query(sql, binding, (err, result) => {
            if (err) {
              console.error('Error executing MySQL query:', err);
              reject(err);
              return;
            }
            resolve(result);
          });
        });
      };

      const release = () => {
        return new Promise((resolve, reject) => {
          if (connection) {
            console.log("MySQL pool released: threadId " + connection.threadId);
            connection.release();
            resolve();
          } else {
            reject(new Error('No connection to release'));
          }
        });
      };

      resolve({ query, release });
    });
  });
};

const query = (sql, binding) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, binding, (err, result) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

module.exports = { pool, connection, query };
