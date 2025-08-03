const Review = require('../models/review')
const Foodzone = require('../models/foodzone');

module.exports.postReview = async(req,res)=>{
    const foodzone = await Foodzone.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    foodzone.reviews.push(review);
    foodzone.totRating += review.rating;
    foodzone.avgRating = (foodzone.totRating/foodzone.reviews.length);
    await review.save();
    await foodzone.save();
    req.flash('success','Successfully added the review!');
    res.redirect(`/foodzones/${foodzone._id}`);
};


module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId}=req.params;

    const foodzone = await Foodzone.findById(id);

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
        req.flash('error', 'Review not found or already deleted!');
        return res.redirect(`/foodzones/${id}`); 
    }

    foodzone.reviews.pull(reviewId);
    foodzone.totRating -= review.rating;
    if (foodzone.reviews.length > 0) {
        foodzone.avgRating = foodzone.totRating / foodzone.reviews.length;
    } else {
        foodzone.avgRating = 0;
    }

    await foodzone.save();

    req.flash('success','Review deleted successfully!');
    res.redirect(`/foodzones/${foodzone._id}`);
};