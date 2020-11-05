//Importing 3rd party modules
const express = require('express');

//Importing local modules. Controller is where our code is defined
const toDOListController = require('../controllers/controllers');
const authController = require('../controllers/authController');

routers = express.Router(); //Creating an instance of router

//Whenever any post request comes on localhost://8080/auth/register it will fire the register function in the authcontroller
routers.post('/auth/register', authController.register);

routers.post('/auth/login', authController.login);

routers.post('/auth/validate', authController.validate_token);

routers.get('/',toDOListController.sendList)

routers.post('/',authController.validate_token, toDOListController.saveList)

routers.put('/' , authController.validate_token, toDOListController.editList)

routers.delete('/:id' ,  toDOListController.deleteList)

module.exports = routers;