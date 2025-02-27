const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg); // Changed status code to 400 for validation errors
    }
    else {
        next();
    }
};

router.get("/", wrapAsync(async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (error) {
        next(new ExpressError(500, "Internal Server Error")); // Handle potential errors
    }
}));


// new route
router.get("/new", wrapAsync(async (req, res, next) => {
    res.render("listings/new.ejs");
}));


//show route
router.get("/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews"); // Use findById instead of findByIdAndUpdate
    if (!listing) {
        req.flash("error", "The Listing you requested for does not exist !");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
}));

//create route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (error) {
        next(new ExpressError(500, "Internal Server Error")); // Handle potential errors
    }
}));


//edit route
router.get("/:id/edit", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "The Listing is Edited!");
    res.render("listings/edit.ejs", { listing });
}));

//update
router.put("/:id", validateListing, wrapAsync(async (req, res, next) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "The Listing is Updated!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        next(new ExpressError(500, "Internal Server Error")); // Handle potential errors
    }
}));


//delete route
router.delete("/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "The Listing is Deleted!");

    res.redirect("/listings");
}));


module.exports = router;
