// server/src/controllers/areaController.js
const Area = require('../models/Area');

// Get all areas
exports.getAreas = async (req, res) => {
  try {
    const areas = await Area.findAll();
    res.json(areas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new area
exports.createArea = async (req, res) => {
  try {
    const newArea = await Area.create(req.body);
    res.status(201).json(newArea);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an area
exports.updateArea = async (req, res) => {
  try {
    const [updated] = await Area.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ message: 'Area not found' });
    }
    res.json({ message: 'Area updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an area
exports.deleteArea = async (req, res) => {
  try {
    const deleted = await Area.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Area not found' });
    }
    res.json({ message: 'Area deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
