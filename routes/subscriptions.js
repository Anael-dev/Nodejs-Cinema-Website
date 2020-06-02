var express = require("express");
var router = express.Router();

/* GET movies page. */
router.get("/", function (req, res, next) {
  if (req.session.loggedUser) {
    res.redirect("/subscriptons/allSubscriptons");
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/allMembers", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("View Subscriptons")) {
      try {
        const subscriptons = await subscriptonsBL.getAllSubscriptons();

        res.render("pages/movies", {
          type: "movie",
          option: "all",
          user: req.session.loggedUser,
          members: subscriptons,
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

module.exports = router;
