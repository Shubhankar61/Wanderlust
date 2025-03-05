const { date } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true, // Ensure comment is provided
        maxlength: 500 // Limit comment length
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createAt: {
        type: Date, 
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now // Automatically set updatedAt to the current date
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});


module.exports=mongoose.model("Review", reviewSchema);
