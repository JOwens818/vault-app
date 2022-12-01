import validateToken from "lib/auth/validateToken";
import { generateHash, generateIv, encryptSecretValues } from "lib/crypto/encrypt-decrypt";
import { doesUserSecretExist, createUserSecret } from "lib/db/secrets";
import { doesUserExist } from "lib/db/users";

const handler = async (req, res) => {

  if (req.method === "POST") {

    const secret = req.body.secret;
    const label = req.body.secretLabel;
    const notes = req.body.notes;
    const hashedLabel = generateHash(label);
    const iv = generateIv();

    // Find User
    const userResp = await doesUserExist(req.username);
    if (userResp.status !== "success") {
      return res.status(200).json(userResp);
    }

    // Check if secret already exists
    const userid = userResp.data[0].id;
    const findSecret = await doesUserSecretExist(userid, hashedLabel);
    if (findSecret.status === "error") {
      return res.status(500).json(findSecret);
    }

    if (findSecret.status === "success") {
      return res.status(400).json({ status: "error", message: "Secret already exists" });
    }

    // Encrypt and save
    let encryptedValues;
    try {
      encryptedValues = encryptSecretValues(secret, label, notes, iv);
    } catch (encryptErr) { 
      console.error("Error encrypting values: " + encryptErr);
      return res.status(500).json({ status: "error", message: "Error creating secret" });
    }
    
    const createSecret = await createUserSecret(
      userid, 
      hashedLabel, 
      encryptedValues.encryptedLabel, 
      encryptedValues.encryptedSecret, 
      encryptedValues.encryptedNotes, 
      iv);

    if (createSecret.status === "error") {
      return res.status(500).json({ status: "error", message: "Error creating secret" });
    }

    res.status(200).json({ status: "success", message: "Secret created successfully" });

  } else {
    res.status(400).json({ status: "fail", message: "Expected POST request" });
  }

};

export default validateToken(handler);