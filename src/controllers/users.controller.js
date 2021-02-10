
const md5 = require('md5');
const User = require('../models/user');

class UsersController {

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
			res.send({
				token: user._id
			});
		}).catch(err => {
			console.log(err);
			res.sendStatus(500);
		});
	}

	static me(req, res) {
		User.findOne({
			_id: req.body.token
		}).then(user => {
			if (!user) {
				res.sendStatus(401);
				return;
			}
			delete user.password;
			res.send(user);
		}).catch(err => {
			console.log(err);
			res.sendStatus(500);
		});
	}

}

module.exports = UsersController;
