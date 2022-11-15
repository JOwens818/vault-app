import validateToken from "lib/auth/validateToken";
import { decrypt, generateHash } from "lib/crypto/encrypt-decrypt";
import { doesUserSecretExist } from "lib/db/secrets";
import { doesUserExist } from "lib/db/users";


const handler = async (req, res) => {

  let decryptedSecret;
  let decryptedNotes;
  const hashedLabel = generateHash(req.body.label);

  const userResp = await doesUserExist(req.username);
  if (userResp.status !== "success") {
    return res.status(200).json(userResp);
  }

  const userid = userResp.data[0].id;
  const secretResp = await doesUserSecretExist(userid, hashedLabel);
  if (secretResp.status !== "success") {
    return res.status(200).json(secretResp);
  }

  try {
    const secret = secretResp.data[0][process.env.SECRET_TBL_COL_ENCRYPTEDPW];
    const notes = secretResp.data[0][process.env.SECRET_TBL_COL_NOTES];
    const iv = secretResp.data[0][process.env.SECRET_TBL_COL_IV];
    decryptedSecret = decrypt(secret, iv);
    decryptedNotes = decrypt(notes, iv);
    if (decryptedNotes === "null") {
      decryptedNotes = "";
    }
  } catch (decryptErr) {
    console.error("Error decrypting value: " + decryptErr);
    return res.status(500).json({ status: "error", message: "Error retreiving secret" });
  }

  res.status(200).json(
    { 
      status: "success", 
      data: { 
        secret: decryptedSecret,
        notes: decryptedNotes
      } 
    }
  );

};

export default validateToken(handler);