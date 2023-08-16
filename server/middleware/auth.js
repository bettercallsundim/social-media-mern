import jwt from "jsonwebtoken";
const isVerified = async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  console.log("tokennn", token);
  if (token) {
    let { uid } = jwt.verify(token, "cat");
    // console.log("your", decoded);
    if (uid) {
      req.user = {
        uid,
      };
      next();
    } else {
      res.send("not token");
    }
  } else {
    res.send("not found token");
  }
};
export default isVerified;
