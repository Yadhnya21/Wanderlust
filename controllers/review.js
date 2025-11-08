const Review = require('./../models/review.js');
const Listing = require('./../models/listing.js');

module.exports.createReview = (async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success', 'Successfully made a new review!');
    console.log("New Review Added:", newReview);
    res.redirect(`/listings/${listing._id}`);
});

module.exports.destroyReview = (async (req, res) => {
    let {reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/listings/${listing._id}`);
});