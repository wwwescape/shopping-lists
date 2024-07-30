// server/src/routes/areas.js
const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');

// Routes
router.get('/', areaController.getAreas);
router.post('/', areaController.createArea);
router.put('/:id', areaController.updateArea);
router.delete('/:id', areaController.deleteArea);

module.exports = router;
