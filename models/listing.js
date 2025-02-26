const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review=require("./review.js");

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
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({ _id:{$in:listing.reviews}});
    }
});


const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
