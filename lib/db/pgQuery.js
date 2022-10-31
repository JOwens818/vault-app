import { connectToPg } from './pgConnect';

const runQuery = async (sql, params) => {
  const pool = await connectToPg();
  return pool
    .query(sql, params)
    .then(res => {
      return {
        status: "success",
        data: res.rows
      };
    })
    .catch(err => {
      console.error(err.message);
      return {
        status: "error",
        message: err.message
      };
    });
}

const findUser = async (username) => {
  const sql = "SELECT * FROM users WHERE username = $1";
  const retreivedUser = await runQuery(sql, [username]);
  
  if (retreivedUser.status !== "success") {
    return retreivedUser;
  }
  
  if (retreivedUser.data.length === 0) {
    return { status: "fail", message: "This username does not exist" };
  }

  console.log(retreivedUser);
  return retreivedUser;
}



export { runQuery, findUser };