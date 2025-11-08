const Listing = require('./../models/listing.js');
const axios = require('axios'); // ✅ required for free geocoding API

module.exports.index = async (req, res) => {
   const { category } = req.query;
  let allListings;
  
  if (category) {
    allListings = await Listing.find({ category });
  } else {
    allListings = await Listing.find({});
  }
  
  res.render("./listings/index", { allListings, category });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: 'review', populate: { path: 'author' } })
    .populate("owner");

  if (!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }

  console.log(listing);
  res.render("listings/show", { listing });
};

// ✅ CREATE LISTING
module.exports.createListing = async (req, res, next) => {
  try {
    if (!req.body.listing) {
      throw new Error("Listing data missing from form submission");
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // 📍 get coordinates from OpenStreetMap (free)
    const location = req.body.listing.location;
    let lat = 19.0760, lon = 72.8777; // default: Mumbai
    const geoRes = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    );
    if (geoRes.data && geoRes.data.length > 0) {
      lat = geoRes.data[0].lat;
      lon = geoRes.data[0].lon;
    }

    newListing.latitude = lat;
    newListing.longitude = lon;

    // ✅ image upload
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await newListing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect('/listings');
  } catch (err) {
    next(err);
  }
};

// ✅ EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }

  let OriginalImageUrl = listing.image.url;
  if (OriginalImageUrl.includes('/upload/')) {
    OriginalImageUrl = OriginalImageUrl.replace(
      '/upload/',
      '/upload/h_100,w_50,c_fill/'
    );
  }

  res.render("listings/edit", { listing, OriginalImageUrl });
};

// ✅ UPDATE LISTING
module.exports.updateListing = async (req, res, next) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // 📍 Update location coordinates if location changes
    if (req.body.listing.location) {
      const geoRes = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}`
      );
      if (geoRes.data && geoRes.data.length > 0) {
        listing.latitude = geoRes.data[0].lat;
        listing.longitude = geoRes.data[0].lon;
      }
    }

    // ✅ Update image if new one uploaded
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await listing.save();
    req.flash('success', 'Successfully updated a listing!');
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a listing!');
  res.redirect("/listings");
};
