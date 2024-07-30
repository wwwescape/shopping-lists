// server/src/routes/categories.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Routes
router.get('/', categoryController.getCategories);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
