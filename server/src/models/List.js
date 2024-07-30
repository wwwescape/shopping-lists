// server/src/models/List.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const List = sequelize.define('List', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [] // Default value for array of items
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: []
  },
  collaborators: {
    type: DataTypes.JSON,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = List;
