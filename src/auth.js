const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { User } = require("../models");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (email, password, callback) {
      User.findOne(
        {
          email: email,
        },
        function (err, doc) {
          if (err) {
            callback(err, null, { message: err.message });
          }
          if (!doc) {
            callback(null, null, { message: "User Not Registered" });
          } else if (!User.checkPassword(password, doc.password)) {
            callback(null, null, { message: "Incorrect Password" });
          } else if (!doc.isActive) {
            callback(null, null, { message: "Inactive User Can't Login" });
          } else {
            callback(null, doc, { message: "Login Successful" });
          }
        }
      );
    }
  )
);
passport.use(
  "local1",
  new LocalStrategy(
    {
      usernameField: "phone",
    },
    function (phone, password, callback) {
      console.log(phone);
      User.findOne(
        {
          phone: phone,
        },
        function (err, doc) {
          if (err) {
            callback(err, null, { message: err.message });
          }
          if (!doc) {
            callback(null, null, { message: "User Not Registered" });
          } else if (!User.checkPassword(password, doc.password)) {
            callback(null, null, { message: "Incorrect Password" });
          } else if (!doc.isActive) {
            callback(null, null, { message: "In active user cannot login" });
          } else {
            doc
              .populate("role")
              .execPopulate()
              .then((c) => callback(null, c, { message: "Login Successful" }))
              .catch((e) => callback(e, null, { message: e.message }));
          }
        }
      );
    }
  )
);

const checkUser = (passport) => {
  // user strategy
  passport.use(
    "user",
    new LocalStrategy(opts, async (jwt_payload, done) => {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, true);
      }
      return done(null, false);
    })
  );
};

module.exports = checkUser;
