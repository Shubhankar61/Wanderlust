const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");    

// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const errmsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errmsg); // Changed status code to 400 for validation errors
//     }else{
//         next();
//     }
// };


//Reviews
//Post Review Route
router.post("/", wrapAsync(async (req, res) => {

    let listing = await Listing.findById(req.body.listingId);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    
    try {
        await listing.save();
        await newReview.save();
    } catch (err) {
        console.error("Error saving review or listing:", err);
        throw new ExpressError(500, "Internal Server Error");
    }
    req.flash("success","The Review is Added!");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
router.delete("/:reviewId", async (req, res) => {
    const { reviewId } = req.params; // Extract listingId & reviewId

    var id = req.body.listingId;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review reference
    await Review.findByIdAndDelete(reviewId); // Delete review itself
    req.flash("success","The Review is Deleted!");
    res.redirect(`/listings/${id}`);
});


module.exports=router;
