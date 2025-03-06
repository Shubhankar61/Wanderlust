const Listing = require("../models/listing");
const Review = require("../models/review");

//createReview
module.exports.createReview=async (req, res) => {

    let listing = await Listing.findById(req.body.listingId);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    try {
        await listing.save();
        await newReview.save();
    } catch (err) {
        console.error("Error saving review or listing:", err);
        throw new ExpressError(500, "Internal Server Error");
    }
    req.flash("success", "The Review is Added!");
    res.redirect(`/listings/${listing._id}`);
};

//deleteReview
module.exports.deleteReview=async (req, res) => {
    const { reviewId } = req.params; // Extract listingId & reviewId

    var id = req.body.listingId;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review reference
    await Review.findByIdAndDelete(reviewId); // Delete review itself
    req.flash("success", "The Review is Deleted!");
    res.redirect(`/listings/${id}`);
};
