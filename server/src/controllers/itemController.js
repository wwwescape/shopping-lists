// server/src/controllers/itemController.js
const Item = require('../models/Item');

// Get all items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  try {
    const [updated] = await Item.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const deleted = await Item.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
