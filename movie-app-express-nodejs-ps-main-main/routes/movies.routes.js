const express = require("express");
const router = express.Router();

const {
  addMovieController,
  updateMovieController,
  getallMoviescontroller,
  getbysingleitemcontroller,
  deleteMovieController,
} = require("../controllers/movies.controller");

const { isAuthorised } = require("../middlewares/authorisation.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { movieSchema } = require("../validations/movie.schema");

router.get("/movies", isAuthorised, getallMoviescontroller);
router.post("/movies", isAuthorised, validate(movieSchema), addMovieController);
router.get("/movies/:movieId", isAuthorised, getbysingleitemcontroller);
router.put(
  "/movies/:movieId",
  isAuthorised,
  validate(movieSchema),
  updateMovieController
);
router.delete("/movies/:movieId", isAuthorised, deleteMovieController);

// //VIEW THE USER DATA

module.exports = router;
