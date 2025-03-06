const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/user");
const { route } = require("./listing");



//signup
router.route("/signup")
    .get(userController.renderSignupform)
    .post(userController.signup);



//login
router.route("/login")
    .get(userController.rederLoginform)
    .post(

        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }), userController.login
    );



//Logout
router.get("/logout", userController.logut);

module.exports = router;