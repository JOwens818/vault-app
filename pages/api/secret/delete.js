import validateToken from "lib/auth/validateToken";
import { validateUserLogin } from "lib/db/users";
import { generateHash, generateIv } from "lib/crypto/encrypt-decrypt";
import { doesUserSecretExist } from "lib/db/secrets";

const handler = async (req, res) => {

  if (req.method === "POST") {

    const pw = req.body.password;
    const label = req.body.secretLabel;
    const hashedLabel = generateHash(label);


    // Validate username/pw
    const userLoginResp = await validateUserLogin(req.username, pw);
    if (userLoginResp.status !== "success") {
      const status = userLoginResp.status === "error"? 500 : 401;
      return res.status(status).json(userLoginResp);
    }

    // Check if secret exists
    const userid = userLoginResp.data.id;
    const findSecret = await doesUserSecretExist(userid, hashedLabel);
    if (findSecret.status !== "success") {
      console.log(findSecret);
      return res.status(500).json(findSecret);
    }

    // Delete Secret


  } else {
    res.status(400).json({ status: "fail", message: "Expected POST request" });
  }

};

export default validateToken(handler);