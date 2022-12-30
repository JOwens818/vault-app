import cookie from 'cookie';

const handler = async (req, res) => {
  
  res.setHeader("Set-Cookie", [`vault_token=deleted; Max-Age=0; path=/`]);
  res.status(200).json({ status: "success", message: "Successful logout" });

}

export default handler;