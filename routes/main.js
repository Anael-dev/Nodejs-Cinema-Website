var express = require("express");
var router = express.Router();

/* GET main page. */
router.get("/", function (req, res, next) {
  if (req.session.loggedUser) {
    res.render("pages/main", { user: req.session.loggedUser });
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

module.exports = router;
