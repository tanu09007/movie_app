const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { models } = require("../config/sequelize-config");

module.exports = {
  isAuthorised: async (req, res, next) => {
    const authorization = req.get("authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const token = authorization.slice("Bearer ".length).trim();
    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (error) {
      return res.status(401).json({ message: "Authentication required." });
    }

    try {
      const user = await models.users.findOne({
        where: { user_id: decoded.user_id },
        attributes: ["user_id"],
      });

      if (!user) {
        return res.status(401).json({ message: "Authentication required." });
      }

      req.decoded = decoded;
      return next();
    } catch (error) {
      console.error("Authentication user lookup failed:", error);
      return res.status(500).json({ message: "Unable to verify account." });
    }
  },
};
