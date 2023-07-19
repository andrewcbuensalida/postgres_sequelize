const Models = require("../models/sequelize");

class UserService {
  constructor(sequelize) {
    Models(sequelize);
    this.client = sequelize;
    this.models = sequelize.models;
  }

  async createUser({ firstName, lastName, email, password }) {
    try {
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
        // attributes: ['firstName', 'lastName', 'email'] // include only these attributes (columns) of the users
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
        include: [
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
        where: { firstName: "tom" },
      });
      currentUser.addUser(toFollowUser);
      return currentUser.getUser();
    } catch (err) {
      return err;
    }
  }
}

module.exports = UserService;
