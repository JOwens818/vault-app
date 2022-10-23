const { Pool } = require('pg');

const creds = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
};

let pool = null;

export const connectToPg = async () => {
  if (!pool) {
    console.log("Initializing postgres connection pool...");
    pool = new Pool(creds);
  }
  return pool;
}