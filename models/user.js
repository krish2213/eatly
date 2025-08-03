const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name :{
        type: String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    picture :
        {
        url : String,
        fileName : String
    }
    ,
    posts :[{
        type : Schema.Types.ObjectId,
        ref : 'Foodzone'
    }]
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);