const { foodzoneSchema,reviewSchema } = require('../schemas');
const catchAsync = require('./catchAsync')
const ExpressError = require('./ExpressError')
const Foodzone = require('../models/foodzone');
const Review = require('../models/review')
const session = require('express-session');


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be logged in first!');
        return res.redirect('/login');
    }
    next();
}
module.exports.storereturnTo = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;

    }
    next();
}

module.exports.validateFoodzone = (req, res, next) => {
    const { error } = foodzoneSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { id } = req.params; 
    req.session.reviewBody = req.body.review.body;
    //console.log(res.locals.reviewBody)
    if (parseInt(req.body.review.rating) < 1) {
        req.flash('error', 'Rating must be at least 1 star!'); 
        return res.redirect(`/foodzones/${id}`);
    }
    delete req.session.reviewBody;
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        req.flash('error', msg); 
        return res.redirect(`/foodzones/${id}`);
    }
    next();
};

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const foodzone = await Foodzone.findById(id);
    if (!foodzone) {
        req.flash('error', 'Foodzone not found.');
        return res.redirect('/foodzones'); 
    }
    if (!foodzone.author._id.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to make modifications');
        return res.redirect(`/foodzones/${id}`); 
    }
    next();
}


module.exports.isAuthorOrReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    const foodzone = await Foodzone.findById(id)
    if (!review) {
        req.flash('error', 'Review not found.');
        return res.redirect(`foodzones/${id}`); 
    }
    if (!(review.author._id.equals(req.user._id)||(foodzone.author._id.equals(req.user._id)))) {
        req.flash('error', 'You do not have permission to make modifications');
        return res.redirect(`/foodzones/${id}`); 
    }
    next();
}
