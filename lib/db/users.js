import { runQuery } from './pgConnect';
import { comparePassword } from 'lib/crypto/hash';


const findUser = async (username) => {
  const sql = "SELECT * FROM users WHERE username = $1";
  const retreivedUserResp = await runQuery(sql, [username]);
  return retreivedUserResp;
}


const createUser = async (username, hashedPw, email) => {
  const sql = "INSERT INTO users(username, password, email) VALUES ($1, $2, $3)";
  const params = [username, hashedPw, email];
  const createdUserResp = await runQuery(sql, params);
  return createdUserResp;
}


const doesUserExist = async (username) => {
  const userResp = await findUser(username);
  if (userResp.status === "success") {
    if (userResp.data.length === 0) {
      return { status: "error", message: "This username does not exist" };
    } else {
      return { status: "success", data: userResp.data };
    }
  }
  return { status: "error", message: "Error retreiving user information" };
}


const validateUserLogin = async (username, pw) => {
  const userResp = await doesUserExist(username);
  if (userResp.status !== "success") {
    return userResp;
  }

  const doesPasswordMatch = await comparePassword(pw, userResp.data[0].password);
  if (!doesPasswordMatch) {
    console.log("Failed password validation by user: " + username);
    return { status: "error", message: "Invalid password" }; 
  }

  return { status: "success", data: { id: userResp.data[0].id } };
}

export { findUser, createUser, doesUserExist, validateUserLogin };