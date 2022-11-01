import { connectToPg } from './pgConnect';


const runQuery = async (sql, params) => {
  const pool = await connectToPg();
  return pool
    .query(sql, params)
    .then(res => {
      console.log(res.rows);
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


const findUser = async (username) => {
  const sql = "SELECT * FROM users WHERE username = $1";
  const retreivedUserResp = await runQuery(sql, [username]);
  
  if (retreivedUserResp.status === "success" && retreivedUserResp.data.length === 0) {
    return { status: "fail", message: "This username does not exist" };
  }

  return retreivedUserResp;
}


const createUser = async (username, hashedPw, email) => {
  const sql = "INSERT INTO users(username, password, email) VALUES ($1, $2, $3)";
  const params = [username, hashedPw, email];
  const createdUserResp = await runQuery(sql, params);
  return createdUserResp;
}


export { runQuery, findUser, createUser };