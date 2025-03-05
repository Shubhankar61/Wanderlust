const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")


// Routers
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.error(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "nirvana",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



app.get("/", async (req, res, next) => {
    res.send("I am shubh");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});





// Router use
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",user);




//Reviews
//Post Review Route
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);
//     await listing.save();
//     await newReview.save();

//     res.redirect(`/listings/${listing.id}`);

//     console.log("new review saved");

// }));

// //Delete Review Route
// app.delete(
//     "/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//         let {id,reviewId}=req.params;
//         await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
//         await Review.findByIdAndDelete(reviewId);
//         res.redirect(`/listings/${id}`);
// }));


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.status(statusCode).send(message);
});

app.listen(1912, () => {
    console.log("Server is listening to port 1912");
});
