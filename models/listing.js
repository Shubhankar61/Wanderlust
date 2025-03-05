const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    description: String,
    image: {
        type: String,
        set: (v) => v == "" ? "https://wallpapercave.com/wp/wp2153319.jpg" : v,
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Ensure price is a positive number
    },
    location: {
        type: String,
        required: true // Ensure location is provided
    },
    country: {
        type: String,
        required: true // Ensure country is provided
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
