import { runQuery } from './pgConnect';

const secretTblName = process.env.SECRET_TBL_NAME;
const hashedLabelCol = process.env.SECRET_TBL_COL_HASHEDLBL;
const encryptedLabelCol = process.env.SECRET_TBL_COL_ENCRYPTEDLBL;
const encryptedSecretCol = process.env.SECRET_TBL_COL_ENCRYPTEDPW;
const notesCol = process.env.SECRET_TBL_COL_NOTES;
const ivCol = process.env.SECRET_TBL_COL_IV;


const findUserSecret = async (userid, hashedLabel) => {
  const params = [userid, hashedLabel];
  const sql = `SELECT * FROM ${secretTblName}
              WHERE userid = $1 
              AND ${hashedLabelCol} = $2`;

  const secretResp = await runQuery(sql, params);
  return secretResp;
}


const createUserSecret = async (userid, hashedLabel, enclabel, secret, notes, iv) => {
  const params = [userid, hashedLabel, enclabel, secret, notes, iv];
  const sql = `INSERT INTO ${secretTblName}
              (userid, ${hashedLabelCol}, ${encryptedLabelCol}, ${encryptedSecretCol}, ${notesCol} , ${ivCol}) 
              VALUES ($1, $2, $3, $4, $5, $6)`;

  const createSecretResp = await runQuery(sql, params);
  return createSecretResp;
}


const doesUserSecretExist = async (userid, hashedLabel) => {
  const secretResp = await findUserSecret(userid, hashedLabel);
  if (secretResp.status === "success") {
    if (secretResp.data.length === 0) {
      return { status: "fail", message: "Secret does not exist" };
    } else {
      return { status: "success", data: secretResp.data };
    }
  }
  return { status: "error", message: "Error retreiving secret information" };
}


const getUserSecretList = async (userid) => {
  const params = [userid];
  const sql = `SELECT id, ${encryptedLabelCol}, ${ivCol} 
              FROM ${secretTblName} WHERE userid = $1 `;
  
  const userListResp = await runQuery(sql, params);
  return userListResp;
}


export { 
  findUserSecret, 
  createUserSecret, 
  doesUserSecretExist, 
  getUserSecretList 
};