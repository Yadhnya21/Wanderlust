const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

module.exports.userSignup = (async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Wanderlust!');
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect("/signup");
  }
});

module.exports.userLogin =  (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.redirectTo || "/listings";
    delete req.session.redirectTo;
    res.redirect(redirectUrl);
  };

  module.exports.userLogout = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Logged you out!");
        res.redirect("/login");
    })
};