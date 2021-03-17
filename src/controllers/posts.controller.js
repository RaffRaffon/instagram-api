
const fs = require('fs').promises; // מה זה השורה הזאת
const Post = require('../models/post'); // מה זה השורה הזאת
const Like = require('../models/likes');// מה זה השורה הזאת
const Comment = require('../models/comment');
class PostsController {

	// static async addComment(req,res){
	// 	try {
	// 	const postId= req.params.id
	// 	const content= req.body.content
	// 	// const createdAt = req.body.createdAt
	// 	const user = req.body.user
	// 	const comment = new Comment({postId:postId, content:content,createdAt:createdAt,user:user})
	// 	const result = await comment.save()
	// 	res.status(201).send(result); 
	// 	} catch (err) {
	// 		console.log(err);
	// 		res.sendStatus(400);
	// 	}
	// }

	static async getComments(req, res){
		const postId= req.params.id
		try{
		const comments=await Comment.find({postId:postId})
		.populate('user', ['username', 'avatar'])
		res.send(comments)
		console.log(comments)
		} catch (err){
			console.log(err);
			res.sendStatus(500)
		}
	}
	static async addComment(req,res){
		const postId= req.params.id
		const {content} = req.body
		const userId = req.user._id
		try{
			const comment = new Comment({
				postId,
				content,
				user:userId
			});
			const savedComment = await comment.save()
			await savedComment.populate('user', ['avatar','username'])
			.execPopulate();
			res.status(201).send(savedComment);
		} catch (err){
			console.log(err);
			res.sendStatus(400)
		}
	}

	static async feed(req, res) {

		try {
			const posts = await Post
				.find()
				.populate('like') // מה זה populate
				.populate('user', ['username', 'avatar'])
				.sort({ createdAt: req.query.sort || 1 }); // מה זה sort
			res.send(posts); // מה זה res.send
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}

	}
	static async like(req, res) {
	
		try {
			// console.log('user',req.user);
			// console.log('body',req.body);
			const like = new Like({gaveLikeTo: req.body.username,LikeRecivedFrom:req.body.LoggedInUser, post: req.body.postId})
			const result = await like.save(); // onst result = await like.save();
			res.status(201).send(result); 
		} catch (err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

	static async checkIfLiked(req,res) {
		const like = await Like.findOne( {gaveLikeTo: req.body.gaveLikeTo,LikeRecivedFrom:req.body.LikeRecivedFrom,post:req.body.postId})
		if (like!=null){
			res.sendStatus(200)
		} else {
			res.sendStatus(401)
		}
	}
	static async unlike(req, res) {
	
		try {
			// console.log('user',req.user);
			// console.log('body',req.body);
			const postId=req.body.postId
			const LikeRecivedFrom=req.body.LikeRecivedFrom
			const result = await Like.deleteOne({post:postId,LikeRecivedFrom:LikeRecivedFrom});
			res.status(201).send(result);
		} catch (err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

	static async create(req, res) {
		const fileName = req.file.filename; // מה זה
		try {
			const imageBase64 = await fs.readFile('public/posts/' + fileName, { // מה זה
				encoding: 'base64' // מה זה
			});

			const post = new Post({ // מה זה
				description: req.body.description,
				image: imageBase64,
				user: req.user._id
			});

			const newPost = await post.save();
			res.status(201).send(newPost);
		} catch (err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

	static async get(req, res) {
		try {
			const post = await Post
				.findById(req.params.id) // מה זה
				.populate('user', ['username', 'avatar']);
			if (!post) {
				res.sendStatus(404);
				return;
			}
			res.json(post);
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}
	}

}

module.exports = PostsController;