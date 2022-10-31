import { signNewJwt } from "lib/auth/jwt";
import { findUser } from "lib/db/pgQuery";
import { comparePassword } from "lib/crypto/hash";
import cookie from 'cookie';


const handler = async (req, res) => {
  
  let isDefaultAdmin = false;
  const username = req.body.username;
  const pw = req.body.password;
  const userResp = await findUser(username);

  // Error occurred getting user from DB
  if (userResp.status === "error") {
    return res.status(500).json({ status: "error", message: "Error retrieving user information" });
  }

  // User was not found in DB
  if (userResp.status === "fail") {
    if (username !== "admin" || (username === "admin" && pw !== "admin")) {
      return res.status(401).json(userResp);
    }
    isDefaultAdmin = true;
  }

  // User found in DB: validate password
  if (!isDefaultAdmin) {
    const doesPasswordMatch = comparePassword(pw, userResp.data[0].password);
    if (!doesPasswordMatch) {
      console.log("Failed login attempt by user: " + username);
      return res.status(401).json({ status: "fail", message: "User is unauthorized" }); 
    }
  }
  
  try {
    let signedJwt = signNewJwt(username);
    const expiry = new Date(new Date().getTime() + 5 * 60 * 1000);
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("vault_token", signedJwt, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        expires: expiry
      })
    );
    console.log("Successful login by user: " + username);
    res.status(200).json({ status: "success", message: "JWT created" });
  } catch (jwtErr) {
    console.error("Error encountered during JWT creation");
    console.error(jwtErr);
    res.status(500).json({ status: "error", message: "Error encountered during JWT creation" })
  }
}

export default handler;