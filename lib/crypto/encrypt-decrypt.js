import crypto from "crypto";
const algorithm = "aes-256-cbc";


const generateHash = (plainText) => {
  return crypto.createHash("sha256").update(plainText).digest("hex").slice(0, 32);
}

const generateIv = () => {
  return crypto.randomBytes(16).toString("hex").slice(0, 16);
}

const encryptPlainText =(plainText, iv) => {
  const key = generateHash(process.env.SECRET_KEY);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(plainText, "utf8", "hex") + cipher.final("hex");
  return Buffer.from(encrypted).toString("base64");
}


const decrypt = (encryptedText, iv) => {
  const key = generateHash(process.env.SECRET_KEY);
  const buff = Buffer.from(encryptedText, "base64");
  const encryptedTextUtf = buff.toString("utf-8");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return decipher.update(encryptedTextUtf, "hex", "utf8") + decipher.final("utf8");
}


const encryptSecretValues = (secret, label, notes, iv) => {
  const encryptedSecret = encryptPlainText(secret, iv);
  const encryptedLabel = encryptPlainText(label, iv);
  const encryptedNotes = encryptPlainText(notes, iv);
  return {
    encryptedSecret: encryptedSecret,
    encryptedLabel: encryptedLabel,
    encryptedNotes: encryptedNotes
  };
}

export { encryptPlainText, decrypt, generateHash, generateIv, encryptSecretValues };