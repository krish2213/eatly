const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const {storereturnTo,isLoggedIn} = require('../utils/middleware')
const users = require('../controllers/users');
const multer = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({storage})


router.route('/register')
    .get(users.registerForm)
    .post(upload.single('image'),catchAsync(users.registerUser));

router.route('/login')
    .get(users.loginForm)
    .post(storereturnTo, passport.authenticate('local',{failureFlash : true, failureRedirect : '/login'}),users.loginUser)

router.get('/logout',users.logoutUser)

router.route('/user/:id')
    .get(catchAsync(users.user))
    .delete(isLoggedIn,catchAsync(users.deleteUser))
    
router.route('/user/:id/editprofile')
    .get(isLoggedIn,catchAsync(users.renderEditForm))
    .put(upload.single('image'),catchAsync(users.editprofile))

module.exports = router;