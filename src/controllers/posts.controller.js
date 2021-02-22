
const fs = require('fs').promises;
const Post = require('../models/post');

class PostsController {

	static async feed(req, res) {

		try {
			const posts = await Post.find();
			res.send(posts);
		} catch(err) {
			console.log(err);
			res.sendStatus(500);
		}

	}

	static async create(req, res) {
		const fileName = req.file.filename;
		try {
			const imageBase64 = await fs.readFile('public/posts/' + fileName, {
				encoding: 'base64'
			});

			const post = new Post({
				description: req.body.description,
				image: imageBase64
			});

			const newPost = await post.save();
			res.status(201).send(newPost);
		} catch(err) {
			console.log(err);
			res.sendStatus(400);
		}
	}

}

module.exports = PostsController;
