// לא הבנתי מה יש כאן בכלל
const express = require('express');
const multer = require('multer');
const UsersController = require('../controllers/users.controller');
const PostsController = require('../controllers/posts.controller');
const auth = require('../middlewares/auth');
const routes = express.Router();
const upload = multer({ dest: 'public/posts' });



routes.put('/user', UsersController.create);
routes.post('/user/login',  UsersController.login);
routes.post('/user/editlogin',  UsersController.editLogin);
routes.post('/user/me', auth, UsersController.me);
routes.post('/user/:id/follow', auth, UsersController.follow);
routes.get('/user/:username/posts', auth, UsersController.posts);
routes.get('/user/:username', auth, UsersController.get);
routes.get('/user', auth, UsersController.getAll);
routes.post('/user',  UsersController.edit)
routes.post('/user/getuserdata',   UsersController.getUserData)
routes.post('/user/getuserdatabyid',UsersController.getUserDataById)
routes.post('/user/:id/follow',UsersController.follow)
routes.post('/user/:id/unfollow',UsersController.unfollow)
routes.post('/user/:id/check',UsersController.checkIfFollow)
routes.post('/user/checkemail', UsersController.checkEmail)
routes.post('/user/checkusername', UsersController.checkUsername)

routes.post('/postedit',PostsController.editPost)
routes.get('/post/explorefeed', auth, PostsController.exploreFeed);
routes.get('/post/:id/comment',PostsController.getComments)
routes.delete('/post/comment',PostsController.deleteComment)
routes.post('/post/comment',PostsController.getCommentData)
routes.post('/post/likeslength', UsersController.getLikesLength);
routes.post('/post/likes',  PostsController.checkIfLiked)
routes.get('/post', auth, PostsController.feed);
routes.post('/post/givelike', auth, PostsController.like);
routes.delete('/post/likes', auth, PostsController.unlike);
routes.delete('/post/delete', auth, PostsController.delete);

routes.put('/post', auth, upload.single('image'), PostsController.create);
routes.get('/post/:id', auth, PostsController.get);
routes.put('/post/:id/comment',auth,PostsController.addComment)

routes.get('/', (req, res) => res.send())

module.exports = routes;



// לא הבנתי מה יש כאן בכלל