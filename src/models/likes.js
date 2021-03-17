
const mongoose = require('mongoose');

const Like = mongoose.model('Like', {
    gaveLikeTo: {
        type: String,
        ref: 'User'
    },
    LikeRecivedFrom:{
        type:String,
        ref: 'User'
    },
    post: {
        type: mongoose.ObjectId,
        ref: 'User'
    },
});

module.exports = Like;
