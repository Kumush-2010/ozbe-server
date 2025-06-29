const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

exports.jwtAccessMiddleware = function (req, res, next) {
    try {
        // const authHeader = req.headers["authorization"];
        // if (!authHeader) {
        //     return res.status(404).send({
        //         error: "Token not found!",
        //     });
        // }

const token = req.cookies.token;

        if (!token) {
            // return res.status(401).json({ message: "Token is missing" });
            return res.redirect('/api/auth/login')
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    
    } catch (error) {
        console.log(error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired!" });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(400).json({ message: "Invalid token!" });
        }

        return res.status(500).json({ message: "Internal server error!" });
    }
};


// const jwt = require('jsonwebtoken');

// exports.jwtAccessMiddleware = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.redirect('/api/admin/login');
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.admin = decoded;
//     next();
//   } catch (err) {
//     return res.redirect('/api/admin/login');
//   }
// };
