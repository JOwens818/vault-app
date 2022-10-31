import bcrypt from "bcrypt";

const createPasswordHash = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

const comparePassword = async (password, hash) => {
  const result = await bcrypt.compare(password, hash);
  return result;
}

export { createPasswordHash, comparePassword }; 