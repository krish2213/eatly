const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync')
// const ExpressError = require('../utils/ExpressError')
// const {reviewSchema} = require('../schemas')
// const Review = require('../models/review')
// const Foodzone = require('../models/foodzone');
const {isLoggedIn, validateReview,isAuthorOrReviewAuthor} = require('../utils/middleware');
const reviews = require('../controllers/reviews')



router.post('/',isLoggedIn, validateReview,catchAsync(reviews.postReview))
router.delete('/:reviewId',isLoggedIn,isAuthorOrReviewAuthor, catchAsync(reviews.deleteReview))
module.exports = router;