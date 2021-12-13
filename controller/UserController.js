const passport = require("../middlewares/partport");
const utils = require("../utils/mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const SendmailController = require("../controller/SendmailController");

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
  getLogout: (req, res, next) => {
    req.logout();
    res.redirect("/home");
  },
  getRegister: (req, res, next) => {
    if (req.user) {
      return res.redirect("/home");
    }
    res.render("register/register", { layout: false });
  },
  postRegister: async (req, res, next) => {
    if (req.body.password !== req.body.re_password) {
      return res.render("register/register", {
        layout: false,
        error: "Mật khẩu không khớp",
      });
    }

    const user = await User.findOne({ email: req.body.email }).lean();
    if (user) {
      return res.render("register/register", {
        layout: false,
        error: "Email đã tồn tại",
      });
    }

    const hash = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      address: req.body.address,
      status: true,
    });
    newUser.save((err) => {
      if (err) return next(err);
      // send mail
      const result = SendmailController.sendMail(
        req.body.email,
        "ĐĂNG KÝ TÀI KHOẢN THÀNH CÔNG!",
        "Chúc mừng bạn đã đăng ký thành công trên MarketPlace!" +
          "<br>" +
          `Email: ${req.body.email}` +
          "<br>" +
          `Mật khẩu: ${req.body.password}`
      );
      res.render("login/login", {
        layout: false,
        message:
          "Đăng ký tài khoản thành công, check mail để xem thông tin tài khoản",
      });
    });
  },

  getMyAccount: async (req, res, next) => {
    if (req.user == null) {
      res.redirect("/login");
      return;
    }
    const user = await User.findOne({ email: req.user.email });

    res.render("my-account/my-account", {
      layout: false,
      user: utils.mongooseToObject(user),
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
        error: "Email đã tồn tại",
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
        error: "Mật khẩu không đúng!!",
      });
      return;
    }
    if (reNewPassword !== newPassword) {
      res.render("my-account/change-password", {
        layout: false,
        error: "Nhập lại mật khẩu sai !!",
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
        error: "Email không tồn tại",
      });
    }

    const result = SendmailController.sendMail(
      req.body.email,
      "Lấy lại mật khẩu",
      `Click vào link sau để đặt lại mật khẩu: http://localhost:3000/reset-password/${user._id}`
    );

    res.render("forgot-password/forgot-password", {
      layout: false,
      message: "Vui lòng check mail để đặt lại mật khẩu",
    });
  },
  getResetPassword: async (req, res, next) => {
<<<<<<< HEAD
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.render("errors/404");
        return;
      }
      res.render("forgot-password/reset-password", {
        layout: false,
        id: req.params.id,
      });
    } catch (err) {
      console.log(err.message);
      res.render("errors/404", { layout: false });
    }
=======
    const user = await User.findById(req.params.id);
    if (!user) {
      res.render("errors/404");
      return;
    }
    res.render("forgot-password/reset-password", {
      layout: false,
      id: req.params.id,
    });
>>>>>>> c94a76b32beb94bc4b270d1a27105dfd13c14c69
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
        error: "Mật khẩu không khớp!",
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
};
