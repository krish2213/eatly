const passport = require('passport')
const User = require('../models/user');
const Foodzone = require('../models/foodzone')
const {storereturnTo} = require('../utils/middleware')
const { cloudinary } = require('../cloudinary')

module.exports.registerForm = (req, res) => {
    res.render('users/register')
};

module.exports.registerUser = async (req, res) => {
    let user;
    try {
        const { name, email, username, password } = req.body;
        user = new User({ email, username, name});
        if(req.file){
        user.picture = {
            url : req.file.path,
            fileName : req.file.filename
        }}
        else{
            user.picture = {
                url : '/images/anonymous.png',
                fileName : 'NoProfile.jpg'
            }
        }
        const newUser = await User.register(user, password);
        req.login(newUser, function(err){
            if(err){
                return next(err);
            }
            req.flash('success', 'Successfully User Registered. Happy Fooding!')
            res.redirect('/foodzones');
        })
    }
    catch(err){
        await  cloudinary.uploader.destroy(user.picture.fileName)
        req.flash('error',err.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req,res)=>{
    if(!req.user){
        res.render('users/login');
    }
    else{
        req.flash('error',`User Already Logged In as @${req.user.username}`)
        res.redirect(`/user/${req.user._id}`);
    }
};

module.exports.loginUser = (req,res)=>{
    req.flash('success',`Welcome Back ${req.user.name}!`);
    const redirectUrl = res.locals.returnTo || '/foodzones' ;
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success','Logged Out!');
        res.redirect('/');
    })
}


module.exports.user = async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate('posts');
    res.render('users/user',{user});
}

module.exports.renderEditForm = async(req, res) => {
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
        req.flash('error', 'Cannot find that user!');
        return res.redirect('/foodzones');
    }
    res.render('users/editprofile',{user});
}

module.exports.editprofile = async(req,res)=>{
    const {id} = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body })
    if(req.file){
        user.picture = {
            url : req.file.path,
            fileName : req.file.filename
        }}
        
    await user.save();
    req.flash('success', 'Successfully edited the profile!');
    res.redirect(`/user/${id}`);
    
}

module.exports.deleteUser = async(req,res)=>{
    const {id} = req.params;
    const user = await User.findById(id).populate('posts');
    for(let post of user.posts){
        for(let img of post.images){
        await cloudinary.uploader.destroy(img.fileName);
    }
    await cloudinary.uploader.destroy(user.picture.fileName);
    await Foodzone.findByIdAndDelete(post.id);
    }
    await User.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the profile!');
    res.redirect(`/foodzones`);

}