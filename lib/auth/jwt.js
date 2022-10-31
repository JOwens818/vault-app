import jwt from "jsonwebtoken";

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

export { signNewJwt, verifyJwt };