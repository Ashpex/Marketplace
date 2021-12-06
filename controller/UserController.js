const passport = require("../middlewares/partport");
const utils = require("../utils/mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// class UserController {
//   //Get
//   getLogin(req, res, next) {
//     if (req.user) {
//       res.redirect("/home");
//       return;
//     }
//     res.render("login/login", {
//       layout: false,
//       wrongLogin: req.query.wrongLogin,
//     });
//   }
//   //Post
//   // postLogin(req, res, next) {
//   //   //console.log("hi");
//   //   passport.authenticate("local", {
//   //     successRedirect: "/",
//   //     failureRedirect: "/login?wrongLogin=1",
//   //   });
//   // }

//   getLogout(req, res, next) {
//     req.logout();
//     res.redirect("/home");
//   }

//   getRegister(req, res, next) {
//     if (req.user) {
//       res.redirect("/home");
//       return;
//     }
//     res.render("register/register", {
//       layout: false,
//       // wrongRegister: req.query.wrongRegister,
//       // wrongPassword: req.query.wrongPassword,
//       // wrongEmail: req.query.wrongEmail,
//       // wrongName: req.query.wrongName,
//       // wrongAddress: req.query.wrongAddress,
//     });
//   }

//   async postRegister(req, res, next) {
//     if (req.body.password !== req.body.re_password) {
//       // res.redirect("/register?wrongRegister");
//       return res.render("register/register", {
//         layout: false,
//         error: "Mật khẩu không khớp",
//       });
//     }
//     // console.log(req.body.password);
//     // if (!req.body.password || !req.body.re_password) {
//     //   // res.redirect("/register?wrongPassword");
//     //   return res.render("register/register", {
//     //     layout: false,
//     //     error: "Mật khẩu không được để trống",
//     //   });
//     // }
//     // if (!req.body.name) {
//     //   res.redirect("/register?wrongName");
//     //   return;
//     // }
//     // if (!req.body.address) {
//     //   res.redirect("/register?wrongAddress");
//     //   return;
//     // }
//     const user = await User.findOne({ email: req.body.email }).lean();
//     if (user) {
//       return res.render("register/register", {
//         layout: false,
//         error: "Email đã tồn tại",
//       });
//     }
//     const hash = bcrypt.hashSync(req.body.password, 10);
//     const newUser = new User({
//       email: req.body.email,
//       password: hash,
//       name: req.body.name,
//       address: req.body.address,
//       status: true,
//     });
//     newUser.save((err) => {
//       if (err) return next(err);
//       res.redirect("/login");
//     });
//   }
// }
// module.exports = new UserController();
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
      res.redirect("/login");
    });
  },

  async getMyAccount(req, res, next) {
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
  async getMyAccountEdit(req, res, next) {
    if (req.user == null) {
      res.redirect("/login");
      return;
    }

    res.render("my-account/edit-account", {
      layout: false,
    });
  },

  async postMyAccountEdit(req, res, next) {
    const user = await User.findOne({ email: req.body.email }).lean();
    if (user && user.email !== req.user.email) {
      return res.render("my-account/edit-account", {
        layout: false,
        error: "Email đã tồn tại",
      });
    }
    if (!req.body.name) {
      return res.render("my-account/edit-account", {
        layout: false,
        error: "Tên không được để trống",
      });
    }
    if (!req.body.address) {
      return res.render("my-account/edit-account", {
        layout: false,
        error: "Địa chỉ không được để trống",
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
  getChangePassword(req, res, next) {
    if (req.user == null) {
      res.redirect("/login");
      return;
    }
    res.render("my-account/change-password", { layout: false });
  },

  async postChangePassword(req, res, next) {
    if (req.user == null) {
      res.redirect("/login");
      return;
    }

    const password = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const reNewPassword = req.body.re_password;

    if (!password || !newPassword || !reNewPassword) {
      res.render("my-account/change-password", {
        layout: false,
        error: "Ô dữ liệu không được để trống!!",
      });
      return;
    }

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
};
