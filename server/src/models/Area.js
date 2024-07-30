// server/src/models/Area.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Area = sequelize.define('Area', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  area_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
});

module.exports = Area;
