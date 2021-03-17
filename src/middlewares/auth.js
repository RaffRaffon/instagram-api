
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/environment/index');

function auth(req, res, next) {

	try {
		const token = req.headers.authorization;
		const user =  jwt.verify(token, jwtSecret);
		req.user = user
		next();
	} catch(err) {
		res.sendStatus(401);
	}

}

module.exports = auth;
