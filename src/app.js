// Express App Setup
require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./auth");

/**
 * Creating the app
 */
const app = express();
/**
 * Configuration
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.options((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-REquested-with,Authorization"
  );
  res.header("Access-Control-Allow-Origin", "PUT,POST,PATCH,DELETE,GET");
  res.status(200).json({});
});
/**
 * Logging Middleware
 */
app.use(require("morgan")("dev"));

app.use(bodyParser.json());
// Express route handlers
app.get("/test", (req, res) => {
  res.status(200).send({ text: "Simple Node App Working!" });
});
app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Backend is Live" });
});

/**
 * Routes
 */
app.use("/user", require("../routes/user.routes"));
app.use("/client", require("../routes/clients.routes"));
app.use("/project", require("../routes/projects.routes"));
app.use("/call", require("../routes/calls.routes"));
app.use("/leadTask", require("../routes/leadTasks.routes"));
app.use("/task", require("../routes/tasks.routes"));
app.use("/lead", require("../routes/leads.routes"));
app.use("/fileupload", require("../routes/fileupload.routes"));

app.use("*", (req, res, next) => {
  res
    .status(404)
    .json({ message: `${req.method} ${req.originalUrl} Not Found` });
});
/**
 * Connect to mongodb
 */

mongoose
  .connect(
    "mongodb+srv://shaiyz:rE49ruy8779bacvP@cluster0.3oevq.mongodb.net/crm?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => {
    return Promise.all([
      mongoose.connection.db.collection("users").countDocuments(),
      mongoose.connection.db.collection("clients").countDocuments(),
    ]);
  })
  .then((doc) => {
    global.USERS = doc[0];
    global.CLIENTS = doc[1];

    global.console.log("Environment Initialized");
  })
  .catch((error) => {
    console.log(error.message);
  });

module.exports = app;
