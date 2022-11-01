import jwt from "jsonwebtoken";
import cookie from 'cookie';


const signNewJwt = (userName) => {
  const privateKey = process.env.JWT_PRIVATE_KEY.replace(/\\n/gm, "\n");
  const jwtExpiresIn = 5 * 60 * 1000;   // short lived - set to 5 min
  let payload = { un: userName };
  return jwt.sign(payload, privateKey, {
    algorithm: "ES256",
    expiresIn: jwtExpiresIn
  });
};


const verifyJwt = (jwtToVerify) => {
  let verifyResult;
  const publicKey = process.env.JWT_PUBLIC_KEY.replace(/\\n/gm, "\n");
  jwt.verify(jwtToVerify, publicKey, (err, decoded) => {
    if (err) {
      verifyResult = {
        "error": err.name,
        "message": err.message
      };
    } else {
      verifyResult = decoded;
    }
  });
  return verifyResult;
};


const sendCookie = (res, username) => {
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

export { signNewJwt, verifyJwt, sendCookie };