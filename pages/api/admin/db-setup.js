import { dbSetup } from "lib/db/setup";

const handler = async (req, res) => {
  
  if (req.method === "POST") {
    console.log(req.body.adminPw);
    if (req.body.adminPw === process.env.ADMINPW) {
      const resp = await dbSetup();
      res.status(200).json(resp);
    } else {
      res.status(401).json({ status: "fail", message: "You are unauthorized to make this request" });
    } 
  } else {
    res.status(400).json({ status: "fail", message: "Expected POST request" });
  }
};

export default handler;