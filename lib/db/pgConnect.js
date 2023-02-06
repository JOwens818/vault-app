const { Pool } = require('pg');

const creds = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
};

let pool = null;

const connectToPg = async () => {
  if (!pool) {
    console.log("Initializing postgres connection pool...");
    pool = new Pool(creds);
  }
  return pool;
}


export const runQuery = async (sql, params) => {
  const pool = await connectToPg();
  return pool
    .query(sql, params)
    .then(res => {
      //console.log(res.rows);
      return {
        status: "success",
        data: res.rows
      };
    })
    .catch(err => {
      console.error("Error executing query: " + err.message);
      return {
        status: "error",
        message: err.message
      };
    });
}