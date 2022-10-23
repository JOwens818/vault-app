import { runQuery } from "lib/pgQuery";

const handler = async (req, res) => {
  
  const sql = "SELECT * FROM colors";
  const resp = await runQuery(sql, []);
  res.status(200).send(resp);
};

export default handler;
