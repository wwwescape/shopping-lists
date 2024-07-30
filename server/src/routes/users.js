// server/src/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
// router.patch('/:id/status', userController.updateUserStatus);
// router.patch('/:id/admin', userController.updateUserAdminStatus);

module.exports = router;
