var express = require("express");
var router = express.Router();
const usersBL = require("../models/usersBL");

/* GET login page. */
router.get("/", function (req, res, next) {
  res.render("pages/userForm", {
    faildMessage: "",
    title: "Log in page",
    action: "login",
  });
});

router.post("/postLogin", async function (req, res, next) {
  try {
    const response = await usersBL.checkLogin(req.body);
    // console.log(response);
    if (response.id) {
      const userData = await usersBL.findUserInJson(response.id);
      console.log(userData);
      if (req.session.loggedUser) {
        //check cradentials and session time//
      } else {
        req.session.loggedUser = {
          id: response.id,
          userName: response.userName,
          fullName: userData.user.firstName + " " + userData.user.lastName,
          admin: userData.user.admin,
          permissions: userData.permissions,
        };
        if (!req.session.loggedUser.admin) {
          req.session.loggedUser.sessionTime = userData.user.sessionTimeOut;
        }
        console.log(req.session.loggedUser);
        // req.session.time=0;
      }
      res.redirect(req.session.returnTo || "/main");
      delete req.session.returnTo;
    } else {
      res.render("pages/userForm", {
        faildMessage: response.message,
        title: "Log in page",
        action: "login",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/createAccount", function (req, res, next) {
  res.render("pages/userForm", {
    faildMessage: "",
    title: "Create an account",
    action: "create",
  });
});

router.post("/postCreateAccount", async function (req, res, next) {
  try {
    const responseMsg = await usersBL.findAndUpdateAccount(req.body);
    if (responseMsg.success) {
      res.redirect("/login");
    } else {
      res.render("pages/userForm", {
        faildMessage: responseMsg.failed,
        title: "Create an account",
        action: "create",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/logout", (req, res, next) => {
  delete req.session.loggedUser;
  res.redirect("/login");
});

module.exports = router;
