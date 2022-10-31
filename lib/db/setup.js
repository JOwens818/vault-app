import { runQuery } from './pgQuery';

const userTable = `CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL
)`;

const passwordTable = `CREATE TABLE IF NOT EXISTS ${process.env.PWTABLE_TABLE_NAME}(
  userid INT NOT NULL,
  ${process.env.PWTABLE_COL_LABEL} TEXT NOT NULL,
  ${process.env.PWTABLE_COL_HASHEDPW} TEXT NOT NULL,
  ${process.env.PWTABLE_COL_IV} TEXT NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
)`;


export const dbSetup = async () => {

  const createUserTableResp = await runQuery(userTable, []);
  if (createUserTableResp.status !== "success") {
    return createUserTableResp;
  }
  console.log("users table created...");

  const createPwTable = await runQuery(passwordTable, []);
  if (createPwTable.status !== "success") {
    return createPwTable;
  }
  console.log(`${process.env.PWTABLE_TABLE_NAME} table created...`);

  return { status: "success", message: "Tables created successfully" };
};