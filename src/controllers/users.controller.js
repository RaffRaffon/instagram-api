
const User = require('../models/user');

class UsersController {

	static create(req, res) {
		const user = new User(req.body);
		user.save()
			.then(newUser => res.status(201).send(newUser))
			.catch(err => {
				console.log(err);
				res.status(400).send(err);
			});
	}

}

module.exports = UsersController;
