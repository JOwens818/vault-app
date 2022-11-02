import crypto from "crypto";
const algorithm = "aes-256-cbc";


const generateHash = (plainText) => {
  return crypto.createHash("sha256").update(plainText).digest("hex").slice(0, 32);
}


const encryptPlainText =(plainText) => {
  const key = generateHash(process.env.SECRET_KEY);
  const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(plainText, "utf8", "hex") + cipher.final("hex");
  return  {
    encrypted: Buffer.from(encrypted).toString("base64"),
    iv: iv
  }
}


const decrypt = (encryptedText, iv) => {
  const key = generateHash(process.env.SECRET_KEY);
  const buff = Buffer.from(encryptedText, "base64");
  const encryptedTextUtf = buff.toString("utf-8");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return decipher.update(encryptedTextUtf, "hex", "utf8") + decipher.final("utf8");
}

export { encryptPlainText, decrypt };