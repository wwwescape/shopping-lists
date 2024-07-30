// server/src/models/Item.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
});

module.exports = Item;
