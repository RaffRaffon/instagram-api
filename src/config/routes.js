
const express = require('express');
const UsersController = require('../controllers/users.controller');
const PostsController = require('../controllers/posts.controller');
const auth = require('../middlewares/auth');
const routes = express.Router();

routes.put('/user', UsersController.create);
routes.post('/user/login', UsersController.login);
routes.post('/user/me', auth, UsersController.me);
routes.get('/user/check', UsersController.check);

routes.get('/post', auth, PostsController.feed);


module.exports = routes;
