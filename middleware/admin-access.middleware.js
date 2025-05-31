const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

exports.adminAccessMiddleware = async (req, res, next) => {
    try {
        // const authHeader = req.headers["authorization"];
        // if (!authHeader) {
        //     return res.status(404).send({
        //         error: "Token not found!",
        //     });
        // }
         const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: "Token topilmadi!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(404).json({ error: "Admin topilmadi!" });
        }

        next();
    } catch (error) {
        console.error("Auth xatosi:", error);
        return res
            .status(401)
            .json({ error: "Noto‘g‘ri yoki eskirgan token!" });
    }
};