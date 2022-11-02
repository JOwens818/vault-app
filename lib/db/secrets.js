import { runQuery } from './pgConnect';


const findUserSecret = async (userid, hashedLabel) => {
  const params = [userid, hashedLabel];
  const sql = `SELECT * FROM ${SECRET_TABLE_NAME}
              WHERE userid = $1 
              AND ${SECRET_TABLE_COL_LABEL} = $2`;

  const secretResp = await runQuery(sql, params);
  return secretResp;
}


const createUserSecret = async (userid, label, secret, iv) => {
  const params = [userid, label, secret, iv];
  const sql = `INSERT INTO ${SECRET_TABLE_NAME}
  (userid, ${SECRET_TABLE_COL_LABEL}, ${SECRET_TABLE_COL_ENCRYPTEDPW}, ${SECRET_TABLE_COL_IV}) 
  VALUES ($1, $2, $3, $4)`;

  const createSecretResp = await runQuery(sql, params);
  return createSecretResp;
}


const doesUserSecretExist = async (userid, label) => {
  const secretResp = await findUserSecret(userid, label);
  if (secretResp.status === "success") {
    if (secretResp.data.length === 0) {
      return { status: "fail", message: "Secret does not exist" };
    } else {
      return { status: "success", data: secretResp.data };
    }
  }
  return { status: "error", message: "Error retreiving secret information" };
}


export { findUserSecret, createUserSecret, doesUserSecretExist };