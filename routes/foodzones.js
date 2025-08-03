const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const { isLoggedIn, isAuthor, validateFoodzone} = require('../utils/middleware');
const foodzones = require('../controllers/foodzones');
const multer = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({storage})



//INDEX OF ALL FOODZONES - CREATE NEW FOODZONE
router.route('/')
    .get(catchAsync(foodzones.index))
    .post(isLoggedIn,upload.array('image'), validateFoodzone, catchAsync(foodzones.createFoodZone))

//ADD NEW FOODZONE
router.get('/new', isLoggedIn, foodzones.renderNewForm)

//FETCH SHOW PAGE FOR A FOODZONE WITH ID - UPDATE FOODZONE (MODIFY) - DELETE FOODZONE!
router.route('/:id')
    .get((foodzones.foodzone))
    .put( isLoggedIn, isAuthor,upload.array('image'), validateFoodzone, catchAsync(foodzones.editFoodZone))  
    .delete(isLoggedIn, isAuthor, catchAsync(foodzones.deleteFoodZone))



//FETCH EDIT PAGE FOR MODIFICATION
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(foodzones.renderEditForm));




module.exports = router;