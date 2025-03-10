const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");

//index & createlisting
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));


// new route
router.get("/new", isLoggedIn, wrapAsync(listingController.newListing));

//show, update & delete listing 
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));


module.exports = router;
