var express = require("express");
var router = express.Router();
const moviesBL = require("../models/moviesBL");

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

router.get("/filteredMovies", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("View Movies")) {
      try {
        const movies = req.session.filteredMovies;
        const mappedMovies = await moviesBL.getFilteredMappedMovies(movies);
        // const msg = req.session.failedMessage;

        res.render("pages/movies", {
          type: "movie",
          option: "all",
          user: req.session.loggedUser,
          movies: mappedMovies,
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
        if (response.length > 0) {
          req.session.filteredMovies = response;
        } else {
          req.session.failedMessage = response;
        }
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

router.get("/addMovie", function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("Create Movies")) {
      res.render("pages/movies", {
        type: "movie",
        option: "add",
        user: req.session.loggedUser,
        movies: "",
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
