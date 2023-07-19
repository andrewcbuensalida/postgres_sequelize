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
			freezeTableName: true,
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

	//hasOne, belognsTo, hasMany, belongsToMany

	//one-to-one => hasOne, belognsTo
	User.hasOne(ContactInfo, {
		foreignKey: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	});
	ContactInfo.belongsTo(User);

	//one-to-many => hasMany, belognsTo
	User.hasMany(Tweet, {
		foreignKey: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	});
	Tweet.belongsTo(User);

	//many-to-many => belongsToMany
	User.belongsToMany(User, {
		as: "User",
		foreignKey: "UserId",
		through: "Follow",
	});
	User.belongsToMany(User, {
		as: "Followed",
		foreignKey: "FollowedId",
		through: "Follow",
	});

	// sequelize.sync({ alter: true }); //force: true will drop table and recreate it again. alter: true won't recreate, just add changes, but for some reason this is getting a drop constraint error, maybe race conditions. match: /regex/ will drop the table if regex matches the database name.
  	sequelize.sync();
};
