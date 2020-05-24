var express = require("express");
var router = express.Router();
const usersBL = require("../models/usersBL");

/* GET usersManagement page. */
router.get("/", function (req, res, next) {
  if (req.session.loggedUser) {
    res.redirect("/usersManagement/allUsers");
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/allUsers", async function (req, res, next) {
  if (req.session.loggedUser) {
    const users = await usersBL.getAllMappedUsers();
    res.render("pages/usersManagement", {
      option: "allUsers",
      user: req.session.loggedUser,
      users: users,
      permissions: "",
    });
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/addUser", async function (req, res, next) {
  if (req.session.loggedUser) {
    const permissions = await usersBL.getAllPermission();
    res.render("pages/usersManagement", {
      option: "addUser",
      user: req.session.loggedUser,
      users: "",
      permissions: permissions,
    });
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/postSaveUser", async function (req, res, next) {
  if (req.session.loggedUser) {
    const response = await usersBL.addUser(req.body);
    response.forEach((x) => console.log(x));

    res.redirect("/usersManagement/allUsers");
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});
router.get("/editUser/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    const id = req.params.id;
    const user = await usersBL.findUser(id);
    const permissions = await usersBL.getAllPermission();

    res.render("pages/usersManagement", {
      option: "editUser",
      user: req.session.loggedUser,
      users: user,
      permissions: permissions,
    });
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/postUpdateUser/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    const id = req.params.id;
    const response = await usersBL.updateUser(req.params.id, req.body);
    response.forEach((x) => console.log(x));
    res.redirect("/usersManagement/allUsers");
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/cancel", function (req, res, next) {
  if (req.session.loggedUser) {
    res.redirect("/usersManagement/allUsers");
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/deleteUser/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    const id = req.params.id;
    const response = await usersBL.deleteUser(id);
    response.forEach((x) => console.log(x));
    res.redirect("/usersManagement/allUsers");
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

module.exports = router;
