const jwt = require("jsonwebtoken");

const passport = require("../middlewares/partport");
const utils = require("../utils/mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const SendmailController = require("../controller/SendmailController");
const Session = require("../models/Session");
const ShoppingCart = require("../models/ShoppingCart");
const CheckOut = require("../models/CheckOut");
const ProductOrder = require("../models/ProductOrder");

module.exports = {
  getLogin: (req, res, next) => {
    if (req.user) {
      res.redirect("/home");
      return;
    }
    res.render("login/login", {
      layout: false,
      wrongLogin: req.query.wrongLogin,
    });
  },
  getLogout: async (req, res, next) => {
    req.logout();
    res.redirect("/home");
    const session = await Session.findOne({ idUser: req.session.unauthId });
    if (session == null) {
      const shoppingCart = await new ShoppingCart({
        listProductOrder: [],
        status: false,
        purchasedTime: new Date().toLocaleString(),
      });
      shoppingCart.save(async (err, data) => {
        if (err) {
          console.log(err);
          res.render("errors/500", { error: err });
        } else {
          const newSession = await new Session({
            idUser: req.session.unauthId,
            idShoppingCart: data._id,
          });
          newSession.save((err) => {
            if (err) {
              console.log(err);
              res.render("errors/500", { error: err });
            }
          });
        }
      });
    }
  },
  getRegister: (req, res, next) => {
    if (req.user) {
      return res.redirect("/home");
    }
    res.render("register/register", { layout: false });
  },

  getActivateAccount: async (req, res, next) => {
    const { token } = req.params;

    if (token) {
      jwt.verify(
        token,
        process.env.JWT_ACC_ACTIVATE,
        function (err, decodedToken) {
          if (err) {
            return res.status(400).json({ error: "Incorrect or expired link" });
          }
          const { id, name, email, password, status } = decodedToken;

          User.findByIdAndUpdate(id, { status: true }, (error) => {
            if (error) {
              console.log(error);
            } else {
              console.log("email verification successful");
            }
          });
        }
      );

      res.json({ mesage: "Sign up success!" });
    } else {
      return res.json({ error: "Something went wrong!" });
    }
  },

  postActivateAccount: async (req, res, next) => {
    const { token } = req.params;
    //const {token} = req.body;
    if (token) {
      jwt.verify(
        token,
        process.env.JWT_ACC_ACTIVATE,
        function (err, decodedToken) {
          if (err) {
            return res.status(400).json({ error: "Incorrect or expired link" });
          }

          const { id, name, email, password, status } = decodedToken;

          User.findByIdAndUpdate(id, { status: true }, (error) => {
            if (error) {
              console.log(error);
            } else {
              console.log("email verification successful");
            }
          });
        }
      );

      res.json({ mesage: "Sign up success!" });
    } else {
      return res.json({ error: "Something went wrong!" });
    }
  },

  postRegister: async (req, res, next) => {
    if (req.body.password !== req.body.re_password) {
      return res.render("register/register", {
        layout: false,
        error: "M???t kh???u kh??ng kh???p",
      });
    }

    const user = await User.findOne({ email: req.body.email }).lean();
    if (user) {
      return res.render("register/register", {
        layout: false,
        error: "Email ???? t???n t???i",
      });
    }

    const { name, email, password } = req.body;

    const hash = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
      email: email,
      password: hash,
      name: req.body.name,
      address: req.body.address,
      status: false,
    });

    newUser.save((err) => {
      if (err) return next(err);
      // send mail
      const id = newUser._id;
      const status = newUser.status;
      const token = jwt.sign(
        { id, name, email, password, status },
        process.env.JWT_ACC_ACTIVATE,
        { expiresIn: "15m" }
      );

      const result = SendmailController.sendMail(
        req.body.email,
        "????NG K?? T??I KHO???N TH??NH C??NG! X??C NH???N EMAIL ????NG K??",
        "Ch??c m???ng b???n ???? ????ng k?? th??nh c??ng tr??n AshStore! B???n vui l??ng x??c nh???n email ????ng k?? b???ng c??ch nh???n v??o ???????ng link sau:" +
          "<br>" +
          "<p>" +
          `${req.protocol}://${req.get("host")}/email-activate/${token}` +
          "<p>" +
          "<br>" +
          `Email: ${req.body.email}` +
          "<br>" +
          `M???t kh???u: ${req.body.password}`
      );

      res.render("login/login", {
        layout: false,
        message:
          "????ng k?? t??i kho???n th??nh c??ng, check mail ????? xem th??ng tin t??i kho???n v?? x??c nh???n t??i kho???n",
      });
    });
  },

  getMyAccount: async (req, res, next) => {
    if (req.user == null) {
      res.redirect("/login");
      return;
    }
    const user = await User.findOne({ email: req.user.email });
    let checkOutUserAll = await CheckOut.find({
      email: req.user.email,
    }).lean();

    for (let i = 0; i < checkOutUserAll.length; i++) {
      const shoppingCartUser = await ShoppingCart.findById(
        checkOutUserAll[i].idShoppingCart
      ).lean();
      checkOutUserAll[i].listProductOrder = [];

      let sum = 0;
      for (let j = 0; j < shoppingCartUser.listProductOrder.length; j++) {
        const productOrder = await ProductOrder.findById(
          shoppingCartUser.listProductOrder[j]
        ).lean();

        sum += productOrder.unitPrice * productOrder.quantity;
        checkOutUserAll[i].listProductOrder.push(productOrder);
      }
      checkOutUserAll[i].total = sum;
    }
    let checkOutPending = [];
    checkOutUserAll.map((item) => {
      if (item.status == "Pending") {
        checkOutPending.push(item);
      }
    });
    let checkOutDelivering = [];
    checkOutUserAll.map((item) => {
      if (item.status == "Delivering") {
        checkOutDelivering.push(item);
      }
    });
    let checkOutDelivered = [];
    checkOutUserAll.map((item) => {
      if (item.status == "Delivered") {
        checkOutDelivered.push(item);
      }
    });
    let checkOutCanceled = [];
    checkOutUserAll.map((item) => {
      if (item.status == "Canceled") {
        checkOutCanceled.push(item);
      }
    });
    res.render("my-account/my-account", {
      layout: false,
      user: utils.mongooseToObject(user),
      checkOutUserAll: checkOutUserAll,
      checkOutPending: checkOutPending,
      checkOutDelivering: checkOutDelivering,
      checkOutDelivered: checkOutDelivered,
      checkOutCanceled: checkOutCanceled,
    });
  },
  getMyAccountEdit: async (req, res, next) => {
    if (req.user == null) {
      res.redirect("/login");
      return;
    }

    res.render("my-account/edit-account", {
      layout: false,
    });
  },

  postMyAccountEdit: async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email }).lean();
    if (user && user.email !== req.user.email) {
      return res.render("my-account/edit-account", {
        layout: false,
        error: "Email ???? t???n t???i",
      });
    }

    await User.findByIdAndUpdate(req.user.id, {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
    })
      .then(() => {
        req.user.name = req.body.name;
        req.user.address = req.body.address;
        req.user.email = req.body.email;
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        res.render("errors/404");
      });
  },
  getChangePassword: (req, res, next) => {
    if (req.user == null) {
      res.redirect("/login");
      return;
    }
    res.render("my-account/change-password", { layout: false });
  },

  postChangePassword: async (req, res, next) => {
    if (req.user == null) {
      res.redirect("/login");
      return;
    }

    const password = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const reNewPassword = req.body.re_password;

    const user = await User.findById(req.user.id);
    if (!bcrypt.compareSync(password, user.password)) {
      res.render("my-account/change-password", {
        layout: false,
        error: "M???t kh???u kh??ng ????ng!!",
      });
      return;
    }
    if (reNewPassword !== newPassword) {
      res.render("my-account/change-password", {
        layout: false,
        error: "Nh???p l???i m???t kh???u sai !!",
      });
      return;
    }
    const hash = bcrypt.hashSync(req.body.newPassword, 10);
    User.findByIdAndUpdate(req.user.id, { password: hash })
      .then(() => {
        res.redirect("/home");
      })
      .catch((err) => {
        console.log(err);
        res.render("errors/404");
      });
  },

  getForgotPassword: (req, res, next) => {
    res.render("forgot-password/forgot-password", { layout: false });
  },
  postForgotPassword: async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email }).lean();
    if (!user) {
      return res.render("forgot-password/forgot-password", {
        layout: false,
        error: "Email kh??ng t???n t???i",
      });
    }

    const result = SendmailController.sendMail(
      req.body.email,
      "L???y l???i m???t kh???u",
      `Click v??o link sau ????? ?????t l???i m???t kh???u: ${req.protocol}://${req.get(
        "host"
      )}/reset-password/${user._id}`
    );

    res.render("forgot-password/forgot-password", {
      layout: false,
      message: "Vui l??ng check mail ????? ?????t l???i m???t kh???u",
    });
  },
  getResetPassword: async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.render("errors/404");
      return;
    }

    res.render("forgot-password/reset-password", {
      layout: false,
      id: req.params.id,
    });
  },
  postResetPassword: async (req, res, next) => {
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.render("errors/404");
    }

    if (req.body.password !== req.body.confirm_password) {
      return res.render("forgot-password/reset-password", {
        layout: false,
        id: req.body.id,
        error: "M???t kh???u kh??ng kh???p!",
      });
    }

    const hash = bcrypt.hashSync(req.body.password, 10);
    User.findByIdAndUpdate(req.body.id, { password: hash })
      .then(() => {
        return res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
        res.render("errors/404", { layout: false });
      });
  },
  getCancelCheckOut: async (req, res) => {
    if (!req.user) {
      res.redirect("/login");
      return;
    }
    const { idCheckOut } = req.params;
    try {
      await CheckOut.findByIdAndUpdate(idCheckOut, {
        status: "Canceled",
      });
      return res.redirect("/myaccount");
    } catch (error) {
      return res.redirect("/myaccount?error=errorCheckOut");
    }
  },
  getConfirmCheckOut: async (req, res) => {
    if (!req.user) {
      res.redirect("/login");
      return;
    }
    const { idCheckOut } = req.params;
    try {
      await CheckOut.findByIdAndUpdate(idCheckOut, {
        status: "Delivered",
      });
      return res.redirect("/myaccount");
    } catch (error) {
      return res.redirect("/myaccount?error=errorCheckOut");
    }
  },
};
