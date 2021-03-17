
const mongoose = require('mongoose');

const Comment = mongoose.model('Comment', {
    postId:{
        type:mongoose.ObjectId,
        required:true
    },
    content:{
        type:String
    },
    createdAt:{
        type: Date
    },
    user:{
        type: mongoose.ObjectId,
        ref:'User'
    },
   
});

module.exports = Comment;
