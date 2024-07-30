// server/src/controllers/locationController.js
const Location = require('../models/Location');

// Get all locations
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new location
exports.createLocation = async (req, res) => {
  try {
    const newLocation = await Location.create(req.body);
    res.status(201).json(newLocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a location
exports.updateLocation = async (req, res) => {
  try {
    const [updated] = await Location.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a location
exports.deleteLocation = async (req, res) => {
  try {
    const deleted = await Location.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
