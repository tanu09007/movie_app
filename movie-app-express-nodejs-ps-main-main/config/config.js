require("dotenv").config();

const dbConfig = {
  database: process.env.PG_DB,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  dialect: "postgres",
};

const envConfigs = {
  development: { ...dbConfig },
  test: { ...dbConfig },
  staging: { ...dbConfig },
  uat: { ...dbConfig },
  port: Number(process.env.PORT) || 5678,
  host: process.env.HOST || "localhost",
  jwtSecret: process.env.JWT_SECRET,
};

module.exports = { ...envConfigs };
