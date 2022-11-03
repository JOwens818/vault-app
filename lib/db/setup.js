import { runQuery } from "./pgConnect";

const userTable = `CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL
)`;

const passwordTable = `CREATE TABLE IF NOT EXISTS ${process.env.SECRET_TBL_NAME}(
  id SERIAL PRIMARY KEY,
  userid INT NOT NULL,
  ${process.env.SECRET_TBL_COL_HASHEDLBL} TEXT NOT NULL,
  ${process.env.SECRET_TBL_COL_ENCRYPTEDLBL} TEXT NOT NULL,
  ${process.env.SECRET_TBL_COL_ENCRYPTEDPW} TEXT NOT NULL,
  ${process.env.SECRET_TBL_COL_IV} TEXT NOT NULL,
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
  console.log(`${process.env.SECRET_TBL_NAME} table created...`);

  return { status: "success", message: "Tables created successfully" };
};