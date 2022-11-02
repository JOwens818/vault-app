import { sendCookie } from "lib/auth/jwt";
import { doesUserExist } from "lib/db/users";
import { comparePassword } from "lib/crypto/hash";


const handler = async (req, res) => {
  
  const username = req.body.username;
  const pw = req.body.password;

  // Look for admin creds
  if (username === "admin" && pw === process.env.ADMINPW) {
    return sendCookie(res, username);
  }

  const userResp = await doesUserExist(username);
  if (userResp.status !== success) {
    return res.status(200).json(userResp);
  }

  // User found in DB: validate password
  const doesPasswordMatch = await comparePassword(pw, userResp.data[0].password);
  if (!doesPasswordMatch) {
    console.log("Failed login attempt by user: " + username);
    return res.status(401).json({ status: "fail", message: "Invalid password" }); 
  }

  sendCookie(res, username);

}

export default handler;