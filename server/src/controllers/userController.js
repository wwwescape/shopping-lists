// server/src/controllers/userController.js
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // Import UUID for generating session IDs
const User = require('../models/User');
const Session = require('../models/Session'); // Import Session model

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, firstname, lastname, password } = req.body;

    // Create user in database
    const newUser = await User.create({
      username,
      firstname,
      lastname,
      password,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Update user status (active/inactive)
// exports.updateUserStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const updatedUser = await User.update(
//       { status },
//       { where: { id: req.params.id } }
//     );
//     if (!updatedUser[0]) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ message: 'User status updated' });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Update user admin status
// exports.updateUserAdminStatus = async (req, res) => {
//   try {
//     const { admin } = req.body;
//     const updatedUser = await User.update(
//       { admin },
//       { where: { id: req.params.id } }
//     );
//     if (!updatedUser[0]) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ message: 'User admin status updated' });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// Login user and create session
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a session for the authenticated user
    const sessionId = uuidv4(); // Generate a unique session ID
    await Session.create({
      id: sessionId,
      userId: user.id,
    });

    // Set the session ID as a cookie in the response
    res.cookie('sessionId', sessionId, {
      maxAge: 3600000, // Session max age in milliseconds (e.g., 1 hour)
      httpOnly: true,
      // secure: true, // Enable in production with HTTPS
    });

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Logout user and destroy session
exports.logoutUser = async (req, res) => {
  try {
    const { sessionId } = req.cookies;

    if (!sessionId) {
      return res.status(400).json({ error: 'No session found' });
    }

    // Delete the session from the database
    await Session.destroy({ where: { id: sessionId } });

    // Clear the session cookie
    res.clearCookie('sessionId');

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Check if user is authenticated (middleware function)
exports.isAuthenticated = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (!sessionId) {
      return res.status(401).json({ error: 'Unauthorized. No sessionId.', sessionId });
    }

    // Check if the session exists
    const session = await Session.findByPk(sessionId);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized. sessionID does not exist', sessionId });
    }

    // Attach the user ID to the request object for further processing
    req.userId = parseInt(session.userId);

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
