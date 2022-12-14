import { sendCookie } from "lib/auth/jwt";
import { doesUserExist, createUser } from "lib/db/users";
import { createPasswordHash } from "lib/crypto/hash";


const handler = async (req, res) => {

  const username = req.body.username;
  const pw = req.body.password;
  const email = req.body.email;


  // Validate email address first
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ status: "fail", message: "Invalid email address format" });
  }

  const userResp = await doesUserExist(username);

  // Error occurred getting user from DB
  if (userResp.status === "error" && userResp.message !== "This username does not exist") {
    return res.status(500).json(userResp);
  }

  // User already exists in DB
  if (userResp.status === "success" || username === "admin") {
    return res.status(200).json({ status: "fail", message: "Username already exists" }); 
  }

  const hashedPw = await createPasswordHash(pw);
  const createUserResp = await createUser(username, hashedPw, email);

  if (createUserResp.status === "error") {
    return res.status(500).json({ status: "error", message: "Error creating user" });
  }

  sendCookie(res, username);

}

export default handler;