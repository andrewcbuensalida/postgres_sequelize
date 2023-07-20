// This file doesn't seem to be used
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "John",
        get() {
          // process data before returning to client
          const rawValue = this.getDataValue("firstName");
          return rawValue ? rawValue.toUpperCase() : null;
        },
        set(value) {
          this.setDataValue("firstName", `${value} SET`);
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Doe",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("password", `hashed(${value})`);
        },
      },
      // can also have a virtual field that isn't in the database, then have getters and setters.
    },
    {
      // freezeTableName: true
      tableName: "Employees",
      timestamps: true,
      createdAt: false,
      updatedAt: "updateTimeStamp",
      paranoid: true, // soft deletion. sets a flag that a user is deleted, but doesn't delete it completely. true adds a deletedAt column. You can still force complete deletion with a force: true option in the destroy method. If soft-deleted, can restore.
    }
  );

  sequelize.sync({ alter: true }); //force: true
};
