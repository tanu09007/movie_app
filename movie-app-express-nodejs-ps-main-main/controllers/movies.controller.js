const { models, Sequelize } = require("../config/sequelize-config");
const Op = Sequelize.Op;

const addMovieController = async (req, res) => {
  try {
    const existingMovie = await models.movies.findOne({
      where: { movie_name: req.body.movie_name },
      attributes: ["movie_id"],
    });
    if (existingMovie) {
      return res.status(409).json({ message: "Movie already exists." });
    }

    const movieCreate = await models.movies.create({
      movie_name: req.body.movie_name,
      year: req.body.year,
      user_id: req.decoded.user_id,
    });
    return res.status(201).json(movieCreate);
  } catch (error) {
    console.error("Movie creation failed:", error);
    return res.status(500).json({ message: "Unable to create movie." });
  }
};

const updateMovieController = async (req, res) => {
  try {
    const [updatedCount, updatedMovies] = await models.movies.update(
      {
        movie_name: req.body.movie_name,
        year: req.body.year,
      },
      {
        where: {
          movie_id: req.params.movieId,
          user_id: req.decoded.user_id,
        },
        returning: true,
      }
    );

    if (!updatedCount) {
      return res.status(404).json({ message: "Movie not found." });
    }
    return res.json(updatedMovies[0]);
  } catch (error) {
    console.error("Movie update failed:", error);
    return res.status(500).json({ message: "Unable to update movie." });
  }
};

const getallMoviescontroller = async (req, res) => {
  try {
    const movies = await models.movies.findAll({
      attributes: ["movie_id", "movie_name", "year"],
      where: { user_id: req.decoded.user_id },
      order: [["movie_name", "ASC"]],
    });
    return res.json({ movies });
  } catch (error) {
    console.error("Movie list request failed:", error);
    return res.status(500).json({ message: "Unable to load movies." });
  }
};

const getbysingleitemcontroller = async (req, res) => {
  try {
    const movie = await models.movies.findOne({
      attributes: ["movie_id", "movie_name", "year"],
      where: {
        movie_id: req.params.movieId,
        user_id: req.decoded.user_id,
      },
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }
    return res.json(movie);
  } catch (error) {
    console.error("Movie lookup failed:", error);
    return res.status(500).json({ message: "Unable to load movie." });
  }
};

const deleteMovieController = async (req, res) => {
  try {
    const deletedCount = await models.movies.destroy({
      where: {
        movie_id: req.params.movieId,
        user_id: req.decoded.user_id,
      },
    });

    if (!deletedCount) {
      return res.status(404).json({ message: "Movie not found." });
    }
    return res.status(204).end();
  } catch (error) {
    console.error("Movie deletion failed:", error);
    return res.status(500).json({ message: "Unable to delete movie." });
  }
};

// Sort price
const sortItemPriceController = async (req, res) => {
  try {
    const { sortOrder } = req.query;

    if (sortOrder && (sortOrder === "asc" || sortOrder === "desc")) {
      const items = await models.items.findAll({
        order: [["price", sortOrder]],
      });

      return res.json({
        items,
      });
    } else {
      return res.status(400).json({
        error: 'Invalid sortOrder parameter. Use "asc" or "desc".',
      });
    }
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};

// sort  item name
const sortItemNameController = async (req, res) => {
  try {
    const { sortOrder } = req.query;

    if (
      sortOrder &&
      (sortOrder.toLowerCase() === "asc" || sortOrder.toLowerCase() === "desc")
    ) {
      const items = await models.items.findAll({
        order: [["item_name", sortOrder.toUpperCase()]],
      });

      return res.json({
        items,
      });
    } else {
      return res.status(400).json({
        error: 'Invalid sortOrder parameter. Use "asc" or "desc".',
      });
    }
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};

// filter by price

const filterItemPricecontroller = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    const items = await models.items.findAll({
      where: {
        price: {
          [Op.between]: [minPrice, maxPrice],
        },
      },
      order: [["price", "ASC"]],
    });

    return res.json({
      items,
    });
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
};

//  search by item name
const SearchItemNamecontroller = async (req, res) => {
  try {
    const itemsFind = await models.items.findAndCountAll({
      attributes: ["item_name"],
      where: {
        item_name: {
          [Op.iLike]: `%${req.query.item_name}%`,
        },
      },
      logging: true,
    });
    return res.json({
      itemsFind,
    });
  } catch (error) {
    console.log("\n error...", error);
    return res.send(error);
  }
};
module.exports = {
  addMovieController,
  updateMovieController,
  getallMoviescontroller,
  getbysingleitemcontroller,
  deleteMovieController,
  filterItemPricecontroller,
  SearchItemNamecontroller,
  sortItemNameController,
  sortItemPriceController,
};

////

const listController = async (req, res) => {
  try {
    let sortPrice;
    let whereQuery = {};
    let orderQuery = [];

    //search by item_name
    if (req.query.search) {
      console.log("search");
      whereQuery.item_name = {
        [Op.iLike]: `%${req.query.search}%`,
      };
    }
    // sort by price
    if (req.query.sortPrice) {
      sortPrice = req.query.sortPrice;
      console.log("sortPrice", sortPrice);
      orderQuery.push(["price", sortPrice]);
    }
    // filter price
    if (req.query.priceRange) {
      const priceRanges = req.query.priceRange.split("-");
      const minPrice = parseFloat(priceRanges[0]);
      const maxPrice = parseFloat(priceRanges[1]);
      whereQuery.price = {
        [Op.between]: [minPrice, maxPrice],
      };
    }
    const list = await models.purchases.findAll({
      where: {
        user_id: req.params.user_id,
      },
      order: [
        [models.items, "price", sortPrice ? sortPrice : "ASC"],
        [models.items, "price", sortPrice ? sortPrice : "DESC"],
      ],
      logging: true,
      include: [
        {
          as: "items",
          model: models.items,
          right: true,
          where: whereQuery,
        },
      ],
    });

    return res.json({
      list,
    });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};
