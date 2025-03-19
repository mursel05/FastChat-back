const cookie = require("cookie");
const { verifyAccessToken } = require("../controllers/tokenController");

exports.authenticate = (req, res, next) => {
  try {
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const accessToken = cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = verifyAccessToken(accessToken);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.userId = decoded.sub;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
