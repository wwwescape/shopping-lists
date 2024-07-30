// server/src/middleware/canAccessList.js
const List = require('../models/List');

const canAccessList = async (req, res, next) => {
  try {
    const list = await List.findByPk(req.params.listId);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    if (list.createdBy == req.userId || list.collaborators?.includes(req.userId)) {
      next();
    } else {
      res.status(403).json({ error: 'You are not authorized to access this list' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify list access' });
  }
};

module.exports = canAccessList;
