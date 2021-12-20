const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const numeral = require("numeral");
const session = require("express-session");
const bodyParser = require("body-parser");
const expressHandlebarsSections = require('express-handlebars-sections');

const passport = require("./middlewares/partport");
const route = require("./routes");
const db = require("./utils/db");
db.connectMongoose();

const app = express();
const sessionHandler = require("./middlewares/sessionHandler");
const logger = require("./middlewares/logger")

const apiProductRouter = require('./api/product');

const hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
  helpers: {
    format: (val) => numeral(val).format("0,0") + " đ",
    time: (val, current, block) => {
      var accum = "";
      for (var i = 0; i < val; ++i) accum += block.fn(i + current);
      return accum;
    },
    currentPage: (val, block) => {
      var accum = "";
      accum += block.fn(val);
      return accum;
    },
    rightPage: (val) => Number(val) + 1,
    leftPage: (val) => Number(val) - 1,
    addTwo: (val) => Number(val) + 2,
    ifCond: (v1, operator, v2, options) => {
      switch (operator) {
        case "==":
          return v1 == v2 ? options.fn(this) : options.inverse(this);
        case "===":
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        case "!=":
          return v1 != v2 ? options.fn(this) : options.inverse(this);
        case "!==":
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case "<":
          return v1 < v2 ? options.fn(this) : options.inverse(this);
        case "<=":
          return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case ">":
          return v1 > v2 ? options.fn(this) : options.inverse(this);
        case ">=":
          return v1 >= v2 ? options.fn(this) : options.inverse(this);
        case "&&":
          return v1 && v2 ? options.fn(this) : options.inverse(this);
        case "||":
          return v1 || v2 ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    },

    pageIf: (currentPage, operator, value, options) => {
      switch (operator) {
        case "==":
          return currentPage == value
            ? options.fn(currentPage)
            : options.inverse(currentPage);
        default:
          return options.inverse(this);
      }
    },
  },
});
expressHandlebarsSections(hbs);

app.use('/api/product', apiProductRouter);

app.engine("hbs", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  cookie: {
    maxAge: 1000*60*60*24*365
  },

  secret: "cats" 
}));app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.user = req.user;
  // res.locals.authenticated = !req.user.anonymous;
  next();
});
app.use(sessionHandler);
app.use(logger);
route(app);


// test nodemailer
"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();

// async..await is not allowed in global scope, must use a wrapper
async function main() {


  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service:"Gmail",
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_USER, 
      pass: process.env.GMAIL_PASS, 
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"AshStore 👻" <AshpexStore@gmail.com>', // sender address
    to: "ashstore@sharklasers.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);

app.use((req, res) => {
  res.render("errors/404", { layout: false });
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).render("errors/500", { layout: false, error: err.message });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`App listening on port ${process.env.PORT || 5000}`);
});

