  
const md5 = require('md5');
const User = require('../models/user');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
const Like = require('../models/likes');
const { jwtSecret } = require('../config/environment/index');

class UsersController {

	static check(req, res) {
		password = req.body.password
	}
	static create(req, res) {
		req.body.password = md5(req.body.password);
		const user = new User(req.body);
		user.save()
			.then(newUser => res.status(201).send(newUser))
			.catch(err => {
				console.log(err);
				res.status(400).send(err);
			});
	}

	static login(req, res) {
		User.findOne({
			username: req.body.username,
			password: md5(req.body.password)
		}).then(user => {
			if (!user) {
				res.sendStatus(401);
				return;
			}
			const payload = {
				_id: user._id,
				username: user.username
			};
			const token = jwt.sign(payload, jwtSecret);
			console.log(payload);
			res.send({ token });
		}).catch(err => {
			console.log(err);
			res.sendStatus(500);
		});
	}

	static check(req, res) {
		const { username, email } = req.query;
		if (!username && !email) {
			res.sendStatus(400);
			return;
		}
		let property = email ? 'email' : 'username';

		try {
			User.exists({
				[property]: req.query[property]
			}).then(isExist => {
				res.json(isExist);
			});
		} catch (err) {
			res.status(400).json(err);
		}
	}

	static me(req, res) {
		res.send(req.user);
	}

	static async posts(req, res) {
		const { username } = req.params;
		try {
			const user = await User.findOne({ username });
			if (!user) {
				res.sendStatus(404);
				return;
			}
			const posts = await Post
				.find({ user: user._id })
				.populate('user', ['username', 'avatar']);
			res.json(posts);
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}
	}
	static async getLikesLength(req, res) {
		try {
			const likes = await Like.find({ post: req.body.postId })
			res.json(likes);
		} catch (err) {
			console.log(err);
		}
	}

	static async getUserData(req, res) {
		try {
			const username = req.body.username
			const user = await User.findOne({ username: username })
			res.json(user);
		} catch (err) {
			console.log(err);
		}

	}
	static async getUserDataById(req, res) {
		try {
			const username = req.body.userId
			const user = await User.findOne({ _id: username })
			res.json(user);
		} catch (err) {
			console.log(err);
		}

	}
	static async get(req, res) {
		const { username } = req.params;
		try {
			const user = await User.findOne({ username });
			if (!user) {
				res.sendStatus(404);
				return;
			}
			const { _id, avatar } = user;
			res.json({ _id, username, avatar });
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}
	}

	static async getAll(req, res) {
		const { username } = req.query;
		try {
			const users = await User.find({
				username: new RegExp(username, 'i')
			});
			res.json(users.map(user => ({
				_id: user._id,
				username: user.username,
				avatar: user.avatar,
				bio: user.bio,
				createdAt: user.createdAt
			})));
		} catch (err) {
			console.log(err);
			res.sendStatus(500);
		}
	}
	static async edit(req, res) {
		let user = await User.findOne({
			username: req.body.username,
		})
		var password = md5(req.body.password)
		if (req.body.password.length > 16) {
			password = req.body.password
		}
		let doc = await User.findOneAndUpdate(
			req.body.username,
			{
				password: password,
				email: req.body.email,
				bio: req.body.bio,
				avatar: req.body.avatar
			});
		// console.log("user:",rev((user.password)))
		// console.log("doc:",doc)
		// console.log("body:",req.body)
	}
	static async follow(req, res) {
		const followingUserId = req.body.followingUserId
		const followedUserId = req.body.followedUserId
		if (followingUserId === followedUserId) {
			res.sendStatus(400)
			return
		}
		const user = await User.findOneAndUpdate(
			{ _id: followingUserId },
			{
				$addToSet: {
					following: followedUserId
				}
			},
			{
				new: true
			}
		);
		const user2 = await User.findOneAndUpdate(
			{ _id: followedUserId },
			{
				$addToSet: {
					followers: followingUserId
				}
			},
			{
				new: true
			}
		);
		if (!user) {
			res.sendStatus(404)
			return
		}
		res.send({
			_id: user._id,
			username: user.username,
			followers: user.followers,
			avatar: user.avatar
		})
	}
	static async checkIfFollow(req, res) {
		const followingUserId = req.body.followingUserId
		const following = await User.findOne({ _id: followingUserId })
		const followedUserId = req.body.followedUserId
		const followed = await User.findOne({ _id: followedUserId });
		if (following.following.includes(followed._id)) {
			res.sendStatus(200)
			return
		} else {
			res.sendStatus(400)
			return
		}
	}
	static async unfollow(req, res) {
		const followingUserId = req.body.followingUserId
		const followedUserId = req.body.followedUserId
		if (followingUserId === followedUserId) {
			res.sendStatus(400)
			return
		}
		const user = await User.findOneAndUpdate(
			{ _id: followingUserId },
			{
				$pull: {
					following: followedUserId
				}
			},
			{
				new: true
			}
		);
		const user2 = await User.findOneAndUpdate(
			{ _id: followedUserId },
			{
				$pull: {
					followers: followingUserId
				}
			},
			{
				new: true
			}
		);
		if (!user) {
			res.sendStatus(404)
			return
		}
		res.send({
			_id: user._id,
			username: user.username,
			followers: user.followers,
			avatar: user.avatar
		})
	}
}
module.exports = UsersController;