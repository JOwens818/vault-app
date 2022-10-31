import validateToken from "lib/auth/validateToken";

const handler = async (req, res) => {
  // validateToken wrapper will return 407 if invalid
  return res.status(200).json({
    status: "success",
    data: { username: req.username }
  });
};

export default validateToken(handler);