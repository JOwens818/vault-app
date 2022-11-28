import { sendCookie } from "lib/auth/jwt";
import { validateUserLogin } from "lib/db/users";


const handler = async (req, res) => {
  
  const username = req.body.username;
  const pw = req.body.password;

  // Look for admin creds
  if (username === "admin" && pw === process.env.ADMINPW) {
    return sendCookie(res, username);
  }
  
  const userLoginResp = await validateUserLogin(username, pw);
  if (userLoginResp.status !== "success") {
    const status = userLoginResp.status === "error" ? 500 : 401;
    return res.status(status).json(userLoginResp);
  }
    
  sendCookie(res, username);

}

export default handler;