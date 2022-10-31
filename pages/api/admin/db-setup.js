import { dbSetup } from "lib/db/setup";

const handler = async (req, res) => {
  const resp = await dbSetup();
  res.status(200).send(resp);
};

export default handler;