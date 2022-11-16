import validateToken from "lib/auth/validateToken";
import { validateUserLogin } from "lib/db/users";

const handler = async (req, res) => {

  if (req.method === "POST") {

    // Validate username/pw
    const userLoginResp = await validateUserLogin(username, pw);
    if (userLoginResp.status !== "success") {
      const status = userLoginResp.status === "error"? 500 : 401;
      return res.status(status).json(userLoginResp);
    }


  } else {
    res.status(400).json({ status: "fail", message: "Expected POST request" });
  }

};

export default validateToken(handler);