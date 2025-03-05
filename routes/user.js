const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware");




//signup
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {
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

});


//login
router.get("/login", async (req, res) => {
    res.render("users/login.ejs");
});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash("success", "Welcome to Wanderlust! You are logged in!");
        let redirectUrl=res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);
    });


//Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Success fully logout!");
        res.redirect("/login");
    });
});

module.exports = router;