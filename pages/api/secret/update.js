import validateToken from "lib/auth/validateToken";
import { validateUserLogin } from "lib/db/users";
import { generateHash, generateIv } from "lib/crypto/encrypt-decrypt";
import { encryptSecretValues, updateUserSecret } from "lib/db/secrets";

const handler = async (req, res) => {

  if (req.method === "POST") {

    const pw = req.body.password;
    const secretId = req.body.id;
    const label = req.body.secretLabel;
    const secret = req.body.secret;
    const notes = req.body.notes;
    const hashedLabel = generateHash(label);
    const iv = generateIv();

    // Validate username/pw
    const userLoginResp = await validateUserLogin(req.username, pw);
    if (userLoginResp.status !== "success") {
      const status = userLoginResp.status === "error"? 500 : 401;
      return res.status(status).json(userLoginResp);
    }

    // Encrypt and save
    let encryptedValues;
    try {
      encryptedValues = encryptSecretValues(secret, label, notes, iv);
    } catch (encryptErr) { 
      console.error("Error encrypting values: " + encryptErr);
      return res.status(500).json({ status: "error", message: "Error updating secret" });
    }

    const updateSecret = updateUserSecret(
      secretId, 
      hashedLabel, 
      encryptedValues.encryptedLabel,
      encryptedValues.encryptedSecret, 
      encryptedValues.encryptedNotes, 
      iv);

    if (updateSecret.status === "error") {
      return res.status(500).json({ status: "error", message: "Error updating secret" });
    }

    res.status(200).json({ status: "success", message: "Secret updated successfully" });

  } else {
    res.status(400).json({ status: "fail", message: "Expected POST request" });
  }

};

export default validateToken(handler);