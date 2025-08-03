const Foodzone = require('../models/foodzone');
const User = require('../models/user')
const { cloudinary } = require('../cloudinary')
const { generateFoodzoneDescription } = require('../utils/ai')
const maptilerClient = require('@maptiler/client');
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports.index = async (req, res) => {
    const { q } = req.query;
    let foodzones;
    if (q) {
        const searchRegex = new RegExp(escapeRegex(q), 'i');
        const matchingUsers = await User.find({ "$or": [{ username: searchRegex }, { name: searchRegex }] }).select('_id');
        const userIds = matchingUsers.map(user => user._id);

        const searchConditions = {
            $or: [
                { name: searchRegex },
                { location: searchRegex }
            ]
        };
        if (userIds.length > 0) {
            searchConditions.$or.push({ author: { $in: userIds } });
        }
        if (searchConditions.$or.length === 0) {
            searchConditions.$or.push({ _id: null });
        }
        foodzones = await Foodzone.find(searchConditions).populate('author');

    } else {
        foodzones = await Foodzone.find({}).populate('author');
    }
    res.render('foodzones/index', { foodzones, q });
};
module.exports.renderNewForm = (req, res) => {
    res.render('foodzones/new');
}

module.exports.foodzone = async (req, res, next) => {
    const { id } = req.params;
    try {
        const foodzone = await Foodzone.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
        if (!foodzone) {
            req.flash('error', 'Cannot find that food zone');
            return res.redirect('/foodzones');
        }

        const reviewBody = req.session.reviewBody || '';
        res.render('foodzones/show', { foodzone, reviewBody });
    }
    catch (err) {
        res.render('foodzones/unknown');
    }
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const foodzone = await Foodzone.findById(id);
    if (!foodzone) {
        req.flash('error', 'Cannot find that foodzone!');
        return res.redirect('/foodzones');
    }
    res.render('foodzones/edit', { foodzone });
}


module.exports.createFoodZone = async (req, res, next) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.foodzone.location, { limit: 1 });
    const foodzone = new Foodzone(req.body.foodzone);
    foodzone.geometry = geoData.features[0].geometry;


    const today = new Date();

    const day = String(today.getDate()).padStart(2, '0');
    const monthName = today.toLocaleString('default', { month: 'long' }); // 'August'
    const year = today.getFullYear();

    const formattedDate = `${day} ${monthName} ${year}`;
    

    foodzone.date = formattedDate;
    foodzone.author = req.user._id;
    if (req.files && req.files.length > 0) {
        foodzone.images = req.files.map(f => ({ url: f.path, fileName: f.filename }))
    }
    else {
        foodzone.images = [{ url: '/images/placeholder.jpeg', fileName: 'placeholder.jpeg' }];
    }

    const user = await User.findById(req.user._id);
    await user.posts.push(foodzone);
    foodzone.description = await generateFoodzoneDescription(foodzone);
    await user.save();
    await foodzone.save();
    req.flash('success', 'Successfully added a foodzone!');
    res.redirect(`/foodzones/${foodzone._id}`);
}

module.exports.editFoodZone = async (req, res, next) => {
    const { id } = req.params;
    const foodzone = await Foodzone.findByIdAndUpdate(id, { ...req.body.foodzone }, { new: true });
    const geoData = await maptilerClient.geocoding.forward(req.body.foodzone.location, { limit: 1 });
    foodzone.geometry = geoData.features[0].geometry;
    foodzone.images = foodzone.images || [];

    const images = req.files.map(f => ({ url: f.path, fileName: f.filename }));
    if (images.length > 0) {
        foodzone.images = foodzone.images.filter(img => img.fileName !== 'placeholder.jpeg');
        foodzone.images.push(...images);
    }

    if (req.body.deleteImages && req.body.deleteImages.length > 0) {
        for (let fileName of req.body.deleteImages) {
            await cloudinary.uploader.destroy(fileName);
        }
        foodzone.images = foodzone.images.filter(img => !req.body.deleteImages.includes(img.fileName));
    }

    if (foodzone.images.length === 0) {
        foodzone.images = [{ url: '/images/placeholder.jpeg', fileName: 'placeholder.jpeg' }];
    }

    const desc = await generateFoodzoneDescription(foodzone);


    await foodzone.save();

    req.flash('success', 'Successfully edited the foodzone!');
    res.redirect(`/foodzones/${id}`);
};


module.exports.deleteFoodZone = async (req, res, next) => {
    const { id } = req.params;
    const foodzone = await Foodzone.findById(id).populate('author');
    const authorId = await foodzone.author.id;
    for (let img of foodzone.images) {
        await cloudinary.uploader.destroy(img.fileName);
    }
    await Foodzone.findByIdAndDelete(id);
    await User.findByIdAndUpdate(authorId, { $pull: { posts: id } });
    req.flash('success', 'Successfully deleted the foodzone!');
    res.redirect(`/foodzones`);
}
