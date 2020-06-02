var express = require("express");
var router = express.Router();
const usersBL = require("../models/usersBL");

/* GET users page. */
router.get("/", function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.admin) {
      res.redirect("/users/allUsers");
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/allUsers", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.admin) {
      const users = await usersBL.getAllMappedUsers();
      res.render("pages/users", {
        type: "user",
        option: "all",
        user: req.session.loggedUser,
        users: users,
        permissions: "",
      });
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/addUser", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.admin) {
      const permissions = await usersBL.getAllPermissions();
      res.render("pages/users", {
        type: "user",
        option: "add",
        user: req.session.loggedUser,
        users: "",
        permissions: permissions,
      });
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/postSaveUser", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.admin) {
      const response = await usersBL.addUser(req.body);
      response.forEach((x) => console.log(x));

      res.redirect("/users/allUsers");
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});
router.get("/editUser/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.admin) {
      const id = req.params.id;
      const user = await usersBL.findUser(id);
      const permissions = await usersBL.getAllPermissions();

      res.render("pages/users", {
        type: "user",
        option: "edit",
        user: req.session.loggedUser,
        users: user,
        permissions: permissions,
      });
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/postUpdateUser/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.admin) {
      const id = req.params.id;
      const response = await usersBL.updateUser(req.params.id, req.body);
      response.forEach((x) => console.log(x));
      res.redirect("/users/allUsers");
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
    if (req.session.loggedUser.admin) {
      res.redirect("/users/allUsers");
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/deleteUser/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.admin) {
      const id = req.params.id;
      const response = await usersBL.deleteUser(id);
      response.forEach((x) => console.log(x));
      res.redirect("/users/allUsers");
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

module.exports = router;
