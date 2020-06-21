var express = require("express");
var router = express.Router();
const membersBL = require("../models/membersBL");
const subscriptionsBL = require("../models/subscriptionsBL");

/* GET movies page. */
router.get("/", function (req, res, next) {
  if (req.session.loggedUser) {
    res.redirect("/subscriptions/allMembers");
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/allMembers", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("View Subscriptions")) {
      try {
        const members = await membersBL.getAllMappedMembers();

        res.render("pages/subscriptions", {
          type: "member",
          option: "all",
          user: req.session.loggedUser,
          members: members,
          message: req.flash("message"),
        });
      } catch (err) {
        console.log(err);
      }
    } else if (
      req.session.loggedUser.permissions.includes("Create Subscriptions")
    ) {
      res.redirect("/subscriptions/addMember");
    } else {
      res.redirect("/main");
    }
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.get("/allMembers/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("View Subscriptions")) {
      try {
        const id = req.params.id;
        const member = await membersBL.getOneMappedMember(id);

        res.render("pages/subscriptions", {
          type: "member",
          option: "all",
          user: req.session.loggedUser,
          members: [member],
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

router.get("/deleteMember/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("Delete Subscriptions")) {
      try {
        const id = req.params.id;
        await membersBL.deleteMember(id);
        req.flash("message", "Subscription deleted successfully!");
        res.redirect("/subscriptions");
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

router.get("/addMember", function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("Create Subscriptions")) {
      res.render("pages/subscriptions", {
        type: "member",
        option: "add",
        user: req.session.loggedUser,
        members: "",
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

router.post("/postSaveMember", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("Create Subscriptions")) {
      try {
        await membersBL.addMember(req.body);
        req.flash("message", "Subscription created successfully!");
        res.redirect("/subscriptions");
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
router.get("/editMember/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("Update Subscriptions")) {
      try {
        const id = req.params.id;
        const member = await membersBL.getOneMember(id);

        res.render("pages/subscriptions", {
          type: "member",
          option: "edit",
          user: req.session.loggedUser,
          members: member,
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

router.post("/postUpdateMember/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("Update Subscriptions")) {
      const id = req.params.id;
      try {
        const response = await membersBL.editMember(req.body, id);
        req.flash("message", "Subscription updated successfully!");
        res.redirect("/subscriptions");
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
    res.redirect("/subscriptions");
  } else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  }
});

router.post("/postSubscribedMovie/:id", async function (req, res, next) {
  if (req.session.loggedUser) {
    if (req.session.loggedUser.permissions.includes("Create Subscriptions")) {
      try {
        const id = req.params.id;
        await subscriptionsBL.subscribeToMovie(req.body, id);
        req.flash("message", "Created subscription successfully!");
        res.redirect("/subscriptions");
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
