const express = require('express');

const toDOListController = require('../controllers/controllers');
const authController = require('../controllers/authController');

routers = express.Router();

routers.post('/auth/register', authController.register);

routers.post('/auth/login', authController.login);

routers.post('/auth/validate', authController.validate_token);

routers.get('/',toDOListController.sendList)

routers.post('/',authController.validate_token, toDOListController.saveList)

routers.put('/' , authController.validate_token, toDOListController.editList)

routers.delete('/:id' ,  toDOListController.deleteList)

module.exports = routers;