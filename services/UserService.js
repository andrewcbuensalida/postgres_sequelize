const Models = require("../models/sequelize");

class UserService {
  constructor(sequelize) {
    Models(sequelize);
    this.client = sequelize;
    this.models = sequelize.models;
  }

  async createUser({ firstName, lastName, email, password }) {
    try {
      // create is a combination of build and save
      const user = await this.models.User.create({
        // User comes from models/sequelize/index.js User. We didn't create the create method manually. It comes from sequelize.
        firstName, 
        lastName,
        email,
        password,
      });

      return user;
    } catch (err) {
      return err;
    }
  }

  async getAllUsersAttributes() {
    try {
      const users = await this.models.User.findAll({
        // attributes: ['firstName', 'lastName', 'email'] // include only these attributes (columns) of the users. Can alias if pass an array like ['firstName','First Name']. // can also get aggregates with this.client.fn('COUNT',this.client.col('firstName')) . can group, and order, etc. an do raw: true so we don't have to use toJson() on users to get rid of the metadata.
        attributes: { exclude: ["updatedAt"] }, // to exclude these attributes
      });
      return users;
    } catch (err) {
      return err;
    }
  }

  async findOneUser() {
    try {
      // for a list of methods like findOne, go to https://sequelize.org/docs/v6/core-concepts/model-querying-finders/
      const user = await this.models.User.findOne({
        where: { firstName: "drew" }, // TODO shouldnt be hard-coded
      });
      return user;
    } catch (err) {
      return err;
    }
  }

  async findOneByPk() {
    // console.log(
    // 	`Example Object.getOwnPropertyNames(Object.getPrototypeOf(this.models.User)): `,
    // 	Object.getOwnPropertyNames(Object.getPrototypeOf(this.models.User))
    // );

    try {
      const user = await this.models.User.findByPk(
        "34c2ebf5-b1b8-4f8f-8a37-78f126e70b3a"
      ); // TODO shouldn't be hard-coded
      return user;
    } catch (err) {
      return err;
    }
  }

  async getAllUsers() {
    try {
      const users = await this.models.User.findAll({
        include: [ // this is possible (getting records from other related tables) because the associations like hasOne, belongsTo
          {
            model: this.models.ContactInfo,
            attributes: {
              exclude: ["updatedAt", "createdAt", "UserId"],
            },
          },
          {
            model: this.models.Tweet,
            attributes: { exclude: ["updatedAt", "UserId"] },
          },
        ],
        attributes: { exclude: ["updatedAt", "createdAt"] },
      });
      return users;
    } catch (err) {
      return err;
    }
  }

  async getAllUsersWhere() {
    try {
      const users = await this.models.User.findAll({
        where: { firstName: "wdj" },
      });
      return users;
    } catch (err) {
      return err;
    }
  }

  async updateUser() {
    try {
      const numberOfUsersUpdated = await this.models.User.update(
        { lastName: "lastName changed" },
        { where: { firstName: "drew" } }
      );
      return "updated User";
    } catch (err) {
      return err;
    }
  }

  async deleteUser() {
    try {
      const user = await this.models.User.destroy({
        where: { firstName: "wdj" },
      });
      return "deleted User";
    } catch (err) {
      return err;
    }
  }

  async followUser() {
    try {
      const currentUser = await this.findOneUser();
      const toFollowUser = await this.models.User.findOne({
        where: { firstName: "Andrew" },
      });
      await currentUser.addUser(toFollowUser); // creates a record in the Follow join table and uses the UserId of the toFollowUser for the FollowedId
      return currentUser.getUser(); // these methods are generated based on the belongsToMany as attribute. If no as attribute, it'll be the name of the model.
    } catch (err) {
      return err;
    }
  }
}

module.exports = UserService;
