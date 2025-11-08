const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectTo } = require('../middleware.js');
const userController = require('../controllers/users.js');

router.route("/signup")
    .get((userController.renderSignupForm))
    .post(wrapAsync(userController.userSignup));

router.route("/login")
    .get((userController.renderLoginForm))
    .post(saveRedirectTo,
      passport.authenticate("local", {
        failureFlash: true,      
        failureRedirect: "/login"
      }),
      (userController.userLogin) );

router.get("/logout", (userController.userLogout));


module.exports = router;