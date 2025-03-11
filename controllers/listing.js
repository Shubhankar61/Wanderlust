const Listing = require("../models/listing");

//index listing
module.exports.index = async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (error) {
        next(new ExpressError(500, "Internal Server Error")); // Handle potential errors
    }
};

// newlisting
module.exports.newListing = async (req, res, next) => {
    res.render("listings/new.ejs");
};

//showlisting
module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner"); // Use findById instead of findByIdAndUpdate
    if (!listing) {
        req.flash("error", "The Listing you requested for does not exist !");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
};

//createlisting
module.exports.createListing = async (req, res, next) => {
    try {
        let url=req.file.path;
        let filename=req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image={url,filename};
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (error) {
        next(new ExpressError(500, "Internal Server Error")); // Handle potential errors
    }
};

//editlisting
module.exports.editListing=async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "The Listing is Edited!");
    res.render("listings/edit.ejs", { listing });
};

//updatelisting
module.exports.updateListing=async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        
        if(typeof req.file !=="undefined"){}
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
        
        req.flash("success", "The Listing is Updated!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        next(new ExpressError(500, "Internal Server Error")); // Handle potential errors
    }
};

//deletelisting
module.exports.deleteListing=async (req, res, next) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "The Listing is Deleted!");

    res.redirect("/listings");
};
