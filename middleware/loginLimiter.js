const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 5, 

    handler: (req, res ,next) => {
      res.status(429).render('429', {
        message: "Siz juda ko'p urinish qildingiz. Iltimos, 5 daqiqadan so'ng urinib ko'ring!."
      });
      next ()
    }
  });

