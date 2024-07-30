// server/src/middleware/authMiddleware.js
const { isAuthenticated } = require('../controllers/userController');

const authMiddleware = async (req, res, next) => {
  try {
    await isAuthenticated(req, res, () => {
      next(); // Continue to the next middleware or route handler if authenticated
    });
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    res.status(401).json({ error: 'Unauthorized in authMiddleware' });
  }
};

module.exports = authMiddleware;
