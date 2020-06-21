var express = require("express");
var router = express.Router();
const moviesBL = require("../models/moviesBL");
const { request } = require("../app");

/* GET movies page. */
router.get("/", function (req, res, next) {
  if (req.session.loggedUser) {
    res.redirect("/movies/allMovies");
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/allMovies", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("View Movies")) {
      try {
        const movies = await moviesBL.getAllMappedMovies();

        res.render("pages/movies", {
          type: "movie",
          option: "all",
          user: req.session.loggedUser,
          movies: movies,
          message: req.flash("message"),
        });
      } catch (err) {
        console.log(err);
      }
    } else if (req.session.loggedUser.permissions.includes("Create Movies")) {
      res.redirect("/movies/addMovie");
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/allMovies/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("View Movies")) {
      try {
        const id = req.params.id;
        const movie = await moviesBL.getOneMovie(id);
        console.log(movie);

        res.render("pages/movies", {
          type: "movie",
          option: "all",
          user: req.session.loggedUser,
          movies: [movie],
          message: "",
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/editMovie/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("Update Movies")) {
      try {
        const id = req.params.id;
        const movie = await moviesBL.getOneMovie(id);
        res.render("pages/movies", {
          type: "movie",
          option: "edit",
          user: req.session.loggedUser,
          movies: movie,
          message: "",
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/deleteMovie/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("Delete Movies")) {
      try {
        const id = req.params.id;
        await moviesBL.deleteMovie(id);
        req.flash("message", "Movie deleted successfully!");

        res.redirect("/movies");
      } catch (err) {
        console.log(err);
      }
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/postFindMovies", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("View Movies")) {
      try {
        const response = await moviesBL.findMovies(req.body.textInput);
        req.session.filteredMovies = response;
        res.redirect("/movies/filteredMovies");
      } catch (err) {
        console.log(err);
      }
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/filteredMovies", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("View Movies")) {
      try {
        let mappedMovies;
        const movies = req.session.filteredMovies;
        if (req.session.filteredMovies.length > 0) {
          mappedMovies = await moviesBL.getFilteredMappedMovies(movies);
        }

        res.render("pages/movies", {
          type: "movie",
          option: "all",
          user: req.session.loggedUser,
          movies: mappedMovies ? mappedMovies : [],
          message: "",
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/addMovie", function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("Create Movies")) {
      res.render("pages/movies", {
        type: "movie",
        option: "add",
        user: req.session.loggedUser,
        movies: "",
        message: "",
      });
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/postSaveMovie", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("Create Movies")) {
      try {
        const response = await moviesBL.addMovie(req.body);
        req.flash("message", "Movie created successfully!");
        res.redirect("/movies");
      } catch (err) {
        console.log(err);
      }
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/postUpdateMovie/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("Update Movies")) {
      const id = req.params.id;
      try {
        const response = await moviesBL.editMovie(req.body, id);
        req.flash("message", "Movie updated successfully!");
        res.redirect("/movies");
      } catch (err) {
        console.log(err);
      }
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/cancel", function (req, res, next) {
  if (req.session.loggedUser) {
    res.redirect("/movies");
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});
module.exports = router;
