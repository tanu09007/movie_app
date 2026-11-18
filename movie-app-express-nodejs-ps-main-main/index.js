const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config/config");
const { sequelize } = require("./config/sequelize-config");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());

app.get("/health", async (_req, res) => {
  try {
    await sequelize.authenticate();
    return res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    return res
      .status(503)
      .json({ status: "unavailable", database: "unavailable" });
  }
});

const { notfound } = require("./middlewares/notfound.middleware");
const { errorHandler } = require("./middlewares/errorHandler.middleware");
const ratingRouter = require("./routes/rating.routes");
const userRouter = require("./routes/user.routes");
const getaccount = require("./routes/get-account.routes");
const movies = require("./routes/movies.routes");

app.use("/", userRouter);
app.use("/", ratingRouter);
app.use("/", getaccount);
app.use("/", movies);

app.use(notfound);
app.use(errorHandler);

app.listen(config.port, config.host, () => {
  console.log(`Server running at http://${config.host}:${config.port}/`);
});
