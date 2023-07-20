const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      // this will be pluralized and will be the table name, unless you specify it in the tableName option below
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "John",
        // get() {
        // 	// process data before returning to client
        // 	const rawValue = this.getDataValue("firstName");
        // 	return rawValue ? rawValue.toUpperCase() : null;
        // },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Doe",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { 
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          this.setDataValue("password", `hashed(${value})`); // hashed() doesn't really hash. need to use bcrypt first.
        },
      },
    },
    {
      // can have validate here too for model wide
      timestamps: true, // false won't create createdAt, updatedAt columns
    }
  );

  const ContactInfo = sequelize.define(
    "ContactInfo",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true, // this will prevent pluralizing ContactInfo
      timestamps: true,
    }
  );

  const Tweet = sequelize.define(
    "Tweet",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  //hasOne, belongsTo, hasMany, belongsToMany

  //one-to-one => hasOne, belongsTo. This creates a UserId column in the ContactInfo table. second argument is optional, it makes sure the foreign key is not null and is a uuid. The foreign key should be the one with many.
  User.hasOne(ContactInfo, {
    foreignKey: {
      type: DataTypes.UUID,
      // allowNull: false,
    },
  });
  ContactInfo.belongsTo(User);

  //one-to-many => hasMany, belongsTo
  User.hasMany(Tweet, {
    foreignKey: {
      type: DataTypes.UUID,
      // allowNull: false,
    },
  });
  Tweet.belongsTo(User);

  //many-to-many => belongsToMany. // this creates a join table called Follow
  User.belongsToMany(User, {
    as: "User", // alias so it will becomme getUser in UserService.js
    foreignKey: "UserId", // this is the column name. Without this, it defaults to UserId.
    through: "Follow",
  });
  User.belongsToMany(User, {
    as: "Followed",
    foreignKey: "FollowedId",
    through: "Follow",
  });

  // sequelize.sync({ alter: true }); //force: true will drop table and recreate it again. alter: true won't recreate, just add changes, but for some reason this is getting a drop constraint error, maybe race conditions. match: /regex/ will drop the table if regex matches the table name.
  sequelize.sync(); // could also use sync for each model, like User.sync()
};
