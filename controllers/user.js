const User = require("../models/user");

//signup from
module.exports.renderSignupform=(req, res) => {
    res.render("users/signup.ejs");
};

//Signup
module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to the world of Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }

};

//Login form
module.exports.rederLoginform=async (req, res) => {
    res.render("users/login.ejs");
};

//Login
module.exports.login=async (req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are logged in!");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};

//Logout
module.exports.logut=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Success fully logout!");
        res.redirect("/login");
    });
};
