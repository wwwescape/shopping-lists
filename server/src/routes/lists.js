// server/src/routes/lists.js
const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');
const canAccessList = require('../middleware/canAccessList'); // Import canAccessList middleware

// Routes protected with authMiddleware
router.get('/', authMiddleware, listController.getLists);
router.post('/', authMiddleware, listController.createList);
router.put('/:id', authMiddleware, canAccessList, listController.updateList);
router.delete('/:id', authMiddleware, canAccessList, listController.deleteList);
router.get('/collaborators', authMiddleware, listController.getCollaborators);
router.get('/list/:listId', authMiddleware, canAccessList, listController.getList);
router.post('/list/:listId/addItem', authMiddleware, canAccessList, listController.addItemToList);
router.delete('/list/:listId/deleteItem/:itemName', authMiddleware, canAccessList, listController.deleteItemFromList);
// router.post('/list/:listId/addCollaborator', authMiddleware, canAccessList, listController.addCollaboratorToList);

module.exports = router;
