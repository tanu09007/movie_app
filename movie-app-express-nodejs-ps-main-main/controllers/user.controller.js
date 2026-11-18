const config = require("../config/config");
const { models } = require("../config/sequelize-config");
const helper = require("../services/helper");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const addUserController = async (req, res) => {
  try {
    const searchUser = await models.users.findOne({
      attributes: ["email", "user_name"],
      where: {
        [Op.or]: [{ email: req.body.email }, { user_name: req.body.user_name }],
      },
    });

    if (searchUser) {
      return res
        .status(409)
        .json({ message: "Email or username already exists." });
    }

    const userCreate = await models.users.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      user_name: req.body.user_name,
      user_password: req.body.user_password,
      phone_no: req.body.phone_no,
    });

    return res.status(201).json({
      user: {
        user_id: userCreate.user_id,
        first_name: userCreate.first_name,
        last_name: userCreate.last_name,
        email: userCreate.email,
        user_name: userCreate.user_name,
      },
      message: "User created successfully.",
    });
  } catch (error) {
    console.error("User signup failed:", error);
    return res.status(500).json({ message: "Unable to create account." });
  }
};

//updating the userData
const updateUserController = async (req, res) => {
  try {
    const updateUser = await models.users.update(
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        user_name: req.body.user_name,
        user_password: req.body.user_password,
        phone_no: req.body.phone_no,
      },
      {
        where: {
          user_id: req.decoded.user_id,
        },
        returning: true,
        individualHooks: true,
      }
    );

    res.json({
      updateUser,
    });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};

// login
const loginController = async (req, res, next) => {
  try {
    const searchUser = await models.users.findOne({
      where: {
        user_name: req.body.user_name,
      },
      returning: true,
    });

    if (!searchUser) {
      return res.status(400).json({ message: "User not found." });
    } else {
      const passwordMatch = await helper.comparePassword(
        req.body.user_password,
        searchUser.user_password
      );

      if (passwordMatch) {
        const payload = {
          user_id: searchUser.user_id,
          user_name: searchUser.user_name,
        };
        const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "4h" });

        return res.json({
          token,
        });
      } else {
        return res
          .status(400)
          .json({ message: "password wrong. check the password" });
      }
    }
  } catch (error) {
    console.error("User login failed:", error);
    return res.status(500).json({ message: "Unable to sign in." });
  }
};
const getAccountController = async (req, res, next) => {
  try {
    const usersFind = await models.users.findOne({
      attributes: ["email", "user_name"],
      where: {
        user_name: req.query.user_name || req.decoded.user_name,
      },
      logging: true,
    });
    return res.json({
      usersFind,
    });
  } catch (error) {
    console.log("\n error...", error);
    return res.send(error);
  }
};

module.exports = {
  addUserController,
  updateUserController,
  loginController,
  getAccountController,
};
