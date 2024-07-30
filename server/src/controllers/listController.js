// server/src/controllers/listController.js
const List = require("../models/List");
const User = require('../models/User');
const { getIO } = require("../socketHandler");

// Get all lists
// Get all lists created by logged-in user or where logged-in user is a collaborator
exports.getLists = async (req, res) => {
  try {
    // Fetch all lists from the database
    const allLists = await List.findAll();

    // Filter lists where the logged-in user is a collaborator
    const collaboratorLists = allLists.filter(list => {
      // Check if the logged-in user is listed as a collaborator
      return list.createdBy == req.userId || list.collaborators?.includes(req.userId);
    });

    res.json(collaboratorLists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new list
exports.createList = async (req, res) => {
  try {
    const { name, collaborators } = req.body;
    const newList = await List.create({ name, createdBy: req.userId, collaborators });
    res.status(201).json(newList);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a list
exports.updateList = async (req, res) => {
  try {
    const { name, collaborators } = req.body;
    const [updated] = await List.update({ name, collaborators }, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ message: "List not found" });
    }
    res.json({ message: "List updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a list
exports.deleteList = async (req, res) => {
  try {
    const deleted = await List.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "List not found" });
    }
    res.json({ message: "List deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get list details
exports.getList = async (req, res) => {
  try {
    const listId = req.params.listId;
    const list = await List.findByPk(listId);
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }
    res.json(list);
  } catch (error) {
    console.error("Error getting list:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Add item to list
exports.addItemToList = async (req, res) => {
  try {
    const listId = req.params.listId;
    const { name, quantity, notes } = req.body;
    const list = await List.findByPk(listId);
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }
    list.items.push({ name, quantity, notes });
    await List.update({ items: list.items }, { where: { id: listId } });
    const updatedList = await List.findByPk(listId);
    const io = getIO();
    if (io) {
      io.emit("listUpdated", listId);
      console.log("Emitted listUpdated");
    } else {
      console.warn("Socket.IO not initialized or undefined");
    }
    res.json(updatedList);
  } catch (error) {
    console.error("Error adding item to list:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete item from list
exports.deleteItemFromList = async (req, res) => {
  try {
    const listId = req.params.listId;
    const itemName = req.params.itemName;
    const list = await List.findByPk(listId);
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }
    list.items = list.items.filter((item) => item.name !== itemName);
    await List.update({ items: list.items }, { where: { id: listId } });
    const updatedList = await List.findByPk(listId);
    const io = getIO();
    if (io) {
      io.emit("listUpdated", listId);
      console.log("Emitted listUpdated");
    } else {
      console.warn("Socket.IO not initialized or undefined");
    }
    res.json(updatedList);
  } catch (error) {
    console.error("Error deleting item from list:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getCollaborators = async (req, res) => {
  try {
    const users = await User.findAll();
    const collaborators = users.filter(user => user.id !== req.userId);
    res.json(collaborators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Add collaborator to list
// exports.addCollaboratorToList = async (req, res) => {
//   try {
//     const listId = req.params.listId;
//     const { userId } = req.body;
//     const list = await List.findByPk(listId);
//     if (!list) {
//       return res.status(404).json({ error: "List not found" });
//     }
//     if (!list.collaborators.includes(userId)) {
//       list.collaborators.push(userId);
//       await List.update({ collaborators: list.collaborators }, { where: { id: listId } });
//       const updatedList = await List.findByPk(listId);
//       const io = getIO();
//       if (io) {
//         io.emit("listUpdated", listId);
//         console.log("Emitted listUpdated");
//       } else {
//         console.warn("Socket.IO not initialized or undefined");
//       }
//       res.json(updatedList);
//     } else {
//       res.status(400).json({ error: "User is already a collaborator" });
//     }
//   } catch (error) {
//     console.error("Error adding collaborator to list:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };
