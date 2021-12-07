const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("../models/User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (username, password, done) {
      // console.log(username, password);
      try {
        const user = await User.findOne({ email: username }).lean();
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        if (!validPassword(user, password)) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

function validPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

passport.serializeUser(function (user, done) {
  done(null, {
    email: user.email,
    name: user.name,
    address: user.address,
    id: user._id,
  });
});

passport.deserializeUser(function (user, done) {
  // User.findOne({ email: id }, function (err, user) {
  //   done(err, user);
  // });
  return done(null, user);
});

module.exports = passport;
