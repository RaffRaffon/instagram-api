
const express = require('express');
const multer = require('multer');
const UsersController = require('../controllers/users.controller');
const PostsController = require('../controllers/posts.controller');
const auth = require('../middlewares/auth');
const routes = express.Router();
const upload = multer({ dest: 'public/posts' });

routes.put('/user', UsersController.create);
routes.post('/user/login', UsersController.login);
routes.post('/user/me', auth, UsersController.me);
routes.get('/user/check', UsersController.check);
routes.get('/user/:username/posts', auth, UsersController.posts);
routes.get('/user/:username', auth, UsersController.get);
routes.get('/user', auth, UsersController.getAll);

routes.get('/post', auth, PostsController.feed);
routes.put('/post', auth, upload.single('image'), PostsController.create);
routes.get('/post/:id', auth, PostsController.get);


module.exports = routes;
