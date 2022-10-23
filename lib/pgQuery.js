import { connectToPg } from './pgConnect';

export const runQuery = async (sql, params) => {
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