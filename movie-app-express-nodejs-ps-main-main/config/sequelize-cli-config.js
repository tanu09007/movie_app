require("dotenv").config();

const config = require("./config");

module.exports = {
  development: config.development,
  test: config.test,
};
