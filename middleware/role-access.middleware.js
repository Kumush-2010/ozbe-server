const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const roleAccessMiddleware = function (roles) {
  return async function (req, res, next) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: "Token is missing" });
      }

      const { role } = jwt.verify(token, process.env.JWT_SECRET);

      console.log("ROLE:", role);

      if (!roles.includes(role)) {
        return res.status(403).send({
          error: "Sizga ruxsat yo'q!"
        });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Ichki server xatoligi!"
      });
    }
  };
};

module.exports = { roleAccessMiddleware };
