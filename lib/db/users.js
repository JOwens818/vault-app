import { runQuery } from './pgConnect';


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
      return { status: "fail", message: "This username does not exist" };
    } else {
      return { status: "success", data: userResp.data };
    }
  }
  return { status: "error", message: "Error retreiving user information" };
}


export { findUser, createUser, doesUserExist };