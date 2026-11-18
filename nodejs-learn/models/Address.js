// models/Address.js
const UserDetail = require("./UserDetail");

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Address = sequelize.define("Address", {
  buildingOrLandmark: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Address;

// models/Address.js

Address.belongsTo(UserDetail, { foreignKey: "userMobileNumber" });
