const router = require("express").Router();
const passport = require("passport");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
// const { login } = require("../middlewares");
const bcrypt = require("bcrypt");
const { sendEmail, getRandomChars } = require("../util");
// const checkToken = require("../middlewares/authenticate");

/**
 * @route           POST /user/signin
 * @description     Login with email and password
 */
router.post("/signin", (req, res, next) => {
  passport.authenticate("local", { session: false }, (error, user, info) => {
    if (error || !user) {
      res.status(500).json({ message: info.message });
    } else {
      const token = jwt.sign(user.toObject(), process.env.JWT_SECRET_KEY);
      res.status(200).json({ data: user, token });
    }
  })(req, res, next);
});

/**
 * @route         POST /user/create
 * @description   Insert a user record
 */
router.post("/create", (req, res, next) => {
  new User(req.body)
    .save()
    .then((doc) => {
      if (!doc) return Promise.reject(new Error("Couldn't Create User"));
      res.status(200).json({ data: doc });
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});

/**
 * @route           GET /user
 * @description     Get user limits records
 * @query           ?email={}&role={}&_id={}&name={}&fields={}
 */
router.get("/", (req, res, next) => {
  let query = {};
  let fields = "";
  if ("role" in req.query) query.role = req.query.role;
  if ("isActive" in req.query) query.isActive = req.query.isActive;
  if ("email" in req.query) query.email = req.query.email;
  if ("phone" in req.query) query.phone = req.query.phone;
  if ("_id" in req.query) query._id = { $in: req.query._id.split(",") };
  if ("fields" in req.query) fields = req.query.fields.replace(",", " ");
  User.find(query)
    .select(fields)
    .exec()
    .then((doc) => {
      res.status(200).json({ data: doc });
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});

/**
 * @route   PUT /user/:user_id
 * @desc    Edit a user
 * Only for development, Use PUT /customer/:customer_id and PUT /admin/:admin_id instead.
 */

router.put("/:user_id", (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.params.user_id },
    { ...req.body },
    { new: true, useFindAndModify: false }
  )
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Updated" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route       PUT /user/password/forgot
 * @description Send Email of a new password
 */

router.put("/password/forget", (req, res, next) => {
  const password = getRandomChars(8);
  User.findOneAndUpdate(
    { email: req.body.email },
    { password: bcrypt.hashSync(password, 10) },
    { new: true }
  )
    .then((doc) => {
      if (!doc)
        return Promise.reject(
          new Error(`User with Email '${req.body.email}' Not Found`)
        );
      return sendEmail(doc.email, {
        email: doc.email,
        password,
        message:
          "Here is your new password. Make sure to change after logging in with this password",
      });
    })
    .then(() => {
      res.status(200).json({ data: { status: "Email Sent" } });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route   PUT /user/password/change
 * @desc    Change Password
 * @body    { _id, curr_pass, new_pass }
 */

router.put("/:id/password/change", (req, res, next) => {
  if (!("curr_pass" in req.body && "new_pass" in req.body))
    return res.status(400).json({ message: "Invalid Request Format" });
  User.findById(req.params.id)
    .then((doc) => {
      if (!doc) {
        return Promise.reject(new Error("No Such User Found"));
      } else if (!User.checkPassword(req.body.curr_pass, doc.password)) {
        return Promise.reject(new Error("Current Password is incorrect"));
      } else {
        return User.findByIdAndUpdate(
          req.params.id,
          { password: bcrypt.hashSync(req.body.new_pass, 10) },
          { new: true }
        ).exec();
      }
    })
    .then((doc) => {
      const token = jwt.sign(doc.toObject(), process.env.JWT_SECRET_KEY);
      res.status(200).json({ message: "Password Changed", data: doc, token });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
