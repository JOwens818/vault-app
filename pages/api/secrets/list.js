import validateToken from "lib/auth/validateToken";
import { doesUserExist } from "lib/db/users";
import { getUserSecretList } from "lib/db/secrets";
import { decrypt } from "lib/crypto/encrypt-decrypt";


const handler = async (req, res) => {

  let resultList = [];
  const userResp = await doesUserExist(req.username);
  if (userResp.status !== "success") {
    return res.status(200).json(userResp);
  }

  const userid = userResp.data[0].userid;
  const secretListResp = await getUserSecretList(userid);

  if (secretListResp.status === "error") {
    return res.status(500).json({ status: "error", message: "Error retrieving secrets" });
  }

  secretListResp.data.forEach(item => {
    try {
      const label = item.data[process.env.SECRET_TBL_COL_ENCRYPTEDLBL];
      const iv = item.data[process.env.SECRET_TBL_COL_IV];
      resultList.push({ id: item.data.id, Secret: decrypt(label, iv) });  
    } catch (decryptErr) {
      console.error("Error decrypting value: " + decryptErr);
      return res.status(500).json({ status: "error", message: "Error retrieving secrets" });
    }
  });

  res.status(200).json({ status: "success", data: resultList });

};

export default validateToken(handler);