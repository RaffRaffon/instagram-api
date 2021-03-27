
const fs = require('fs').promises; // מה זה השורה הזאת
const Post = require('../models/post'); // מה זה השורה הזאת
const Like = require('../models/likes');// מה זה השורה הזאת
const Comment = require('../models/comment');
const User = require('../models/user');
class PostsController {

	static async deleteComment(req, res) {
		// const LoggedInUser = req.user
		const commentId = req.body.commentId
		// const CommentRecivedFrom = req.body.CommentRecivedFrom
		// if (LoggedInUser === CommentRecivedFrom)
			const result = await Comment.deleteOne({ _id: commentId });
			res.status(201).send(result);
	}
	
	static async getComments(req, res) {
		const postId = req.params.id
		try {
			const comments = await Comment.find({ postId: postId })
				.populate('user', ['username', 'avatar'])
			res.send(comments)
		} catch (err) {
			console.log(err);
			res.sendStatus(500)
		}
	}

	static async getCommentData(req, res) {
		const commentId = req.body.commentId
		const result = await Comment.findOne({_id:commentId});
		res.status(201).send(result);
	}
	static async addComment(req, res) {
		const postId = req.params.id
		const { content } = req.body
		const userId = req.user._id
		try {
			const comment = new Comment({
				postId,
				content,
				user: userId
			});
			const savedComment = await comment.save()
			await savedComment.populate('user', ['avatar', 'username'])
				.execPopulate();
			res.status(201).send(savedComment);
		} catch (err) {
			console.log(err);
			res.sendStatus(400)
		}
	}

	static async feed(req, res) {
		const { username } = req.user;
		var newPosts = []
		try {

			const posts = await Post
				.find()
				.populate('like') // מה זה populate
				.populate('user', ['username', 'avatar'])
				.sort({ createdAt: req.query.sort || 1 });// מה זה sort
			const user = await User.findOne({ username });
			for (var post of posts) {
				if (user.following.includes(post.user._id)) {
					newPosts.push(post)
				}
			}

			res.send(newPosts); // מה זה res.send
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}

	}
	static async exploreFeed(req, res) {
		try {

			const posts = await Post
				.find()
				.populate('like') // מה זה populate
				.populate('user', ['username', 'avatar'])
				.sort({ createdAt: req.query.sort || 1 });// מה זה sort
			

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
			const like = new Like({ gaveLikeTo: req.body.username, LikeRecivedFrom: req.body.LoggedInUser, post: req.body.postId })
			const result = await like.save(); // onst result = await like.save();
			res.status(201).send(result);
		} catch (err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

	static async checkIfLiked(req, res) {
		const like = await Like.findOne({ gaveLikeTo: req.body.gaveLikeTo, LikeRecivedFrom: req.body.LikeRecivedFrom, post: req.body.postId })
		if (like != null) {
			res.sendStatus(200)
		} else {
			res.sendStatus(401)
		}
	}
	static async unlike(req, res) {

		try {
			// console.log('user',req.user);
			// console.log('body',req.body);
			const postId = req.body.postId
			const LikeRecivedFrom = req.body.LikeRecivedFrom
			const result = await Like.deleteOne({ post: postId, LikeRecivedFrom: LikeRecivedFrom });
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
	static async deleteComment(req, res) {
		// const LoggedInUser = req.user
		const commentId = req.body.commentId
		// const CommentRecivedFrom = req.body.CommentRecivedFrom
		// if (LoggedInUser === CommentRecivedFrom)
			const result = await Comment.deleteOne({ _id: commentId });
			res.status(201).send(result);
	}
	static async delete(req,res){
		const PostId = req.body.PostId
		const result = await Post.deleteOne({ _id: PostId });
		res.status(201).send(result);
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