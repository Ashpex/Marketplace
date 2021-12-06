const express = require("express");
const router = express.Router();
const passport = require("../middlewares/partport");
const UserController = require("../controller/UserController");

// router.post("/login", UserController.postLogin);

router.get("/login", UserController.getLogin);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login?wrongLogin",
  })
);

router.get("/logout", UserController.getLogout);

router.get("/register", UserController.getRegister);

router.post("/register", UserController.postRegister);

router.get("/myaccount", UserController.getMyAccount);

router.get("/myaccount/edit", UserController.getMyAccountEdit);

router.post("/myaccount/edit", UserController.postMyAccountEdit);

module.exports = router;
