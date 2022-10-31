import { verifyJwt } from "lib/auth/jwt";
import cookie from 'cookie';

const validateToken = (handler) => {
  return async (req, res) => {
    const failResp = {
      status: "fail",
      message: "JWT not found or is invalid"
    };
  
    const cookies = cookie.parse(req.headers.cookie || "");
    if (!cookies.vault_token) {
      console.log("JWT validation fail: No JWT found");
      return res.status(401).json(failResp);
    }
    
    try {
      const validation = verifyJwt(cookies.vault_token);
      if (validation.error) {
        console.log("JWT validation fail: " + validation.error + " - " + validation.message);
        return res.status(401).json(failResp);
      } else {
        req.username = validation.un;
        return handler(req, res);
      }
    } catch (jwtError) {
      console.error("JWT validation error: " + jwtError);
      return res.status(500).json({ status: "error", message: "Error encountered during JWT validation" });
    }
  
    
  };
};

export default validateToken;