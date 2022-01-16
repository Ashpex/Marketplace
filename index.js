const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const numeral = require("numeral");
const session = require("express-session");
const bodyParser = require("body-parser");
const expressHandlebarsSections = require("express-handlebars-sections");

const passport = require("./middlewares/partport");
const route = require("./routes");
const db = require("./utils/db");
db.connectMongoose();

const app = express();
const sessionHandler = require("./middlewares/sessionHandler");
const logger = require("./middlewares/logger");
const userShoppingCart = require("./middlewares/userShoppingCart");

const apiProductRouter = require("./api/product");
const apiShoppingCartRouter = require("./api/shopping-cart");
const chatBotRouter = require("./routes/chatbot");
const hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
  helpers: {
    // Function to do basic mathematical operation in handlebar
    math: function (lvalue, operator, rvalue) {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);
      return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue,
      }[operator];
    },
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

app.engine("hbs", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },

    secret: "cats",
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.user = req.user;
  // res.locals.authenticated = !req.user.anonymous;

  next();
});
app.use(sessionHandler);
app.use(logger);
app.use("/api/product", apiProductRouter);
app.use("/api/shoppingCart", apiShoppingCartRouter);
//app.use("/webhook",chatBotRouter);

app.use(userShoppingCart);
route(app);

express()
  .use(bodyParser.json())
  .post("/webhook", (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === "page") {
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function (entry) {
        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log("Sender PSID: " + sender_psid);
      });

      // Return a '200 OK' response to all events
      res.status(200).send("EVENT_RECEIVED");
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  });

express()
  .use(bodyParser.json())
  .get("/webhook", (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "fbverifytoken";

    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
      // Checks the mode and token sent is correct
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  });

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
