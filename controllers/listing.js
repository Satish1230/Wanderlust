const Listing = require("../models/listing");

module.exports.index =
    async (req, res) => {
        const allListing = await Listing.find({});
        res.render("listings/index.ejs", { allListing });
    }

module.exports.renderNewform =
    async (req, res) => {
        res.render("listings/new.ejs");
    }

module.exports.createListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: "author" } }).populate('owner');//populate is used to get the reviews of the listing through ID
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        res.redirect('/listings');
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createForm = async (req, res) => {
    // let { title, description, price, location, country } = req.body;
    let url = req.file.path
    let filename = req.file.filename
    console.log('File uploaded to Cloudinary:', JSON.stringify({ path, filename }, null, 2));

    // const newlisting = new Listing(req.body.listing)
    // newlisting.owner = req.user._id;
    // const listing = await newlisting.save();
    req.flash('success', 'New listing Created!');
    res.redirect("/listings");

}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;             //this line and the next line find the listing by id
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        res.redirect('/listings');
    }
    res.render("listings/edit.ejs", { listing });
}


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash('success', 'Listing updated!');
    res.redirect("/listings");
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted!');
    res.redirect("/listings");
}

