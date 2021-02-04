
const express = require('express');
const UsersController = require('../controllers/users.controller');
const routes = express.Router();

routes.put('/user', UsersController.create);


module.exports = routes;
