
const express = require('express');
const UsersController = require('../controllers/users.controller');
const routes = express.Router();

routes.put('/user', UsersController.create);
routes.post('/user/login', UsersController.login);


module.exports = routes;
