const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review');
const { foodzoneSchema } = require('../schemas');

const FoodzoneSchema = new Schema({
    name: {
        type: String
    },
    location: {
        type: String
        
    },
    geometry : {
        type:{
            type: String,
        enum : ['Point'],
        required : true
        },
        coordinates:{
            type : [Number],
            required : true
        }
        
    },
    author : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    avgPrice: String,
    images: [{
        url : String,
        fileName : String
    }],
    description: {
        type: String,
        
    },
    reviews : [
        {
        type : Schema.Types.ObjectId,
        ref : 'Review'
    }
    ],
    totRating : {
        type : Number,
        default: 0
    },
    avgRating : {
        type : Number,
        default: 0
    },
    date :{
        type: String
    }
})
FoodzoneSchema.post('findOneAndDelete',async function(doc) {

    if(doc){
    await Review.deleteMany({
        _id : {
            $in : doc.reviews
        }
    });
}

})
module.exports = mongoose.model('Foodzone', FoodzoneSchema);