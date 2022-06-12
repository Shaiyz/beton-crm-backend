const express = require("express");
const passport = require("passport");
const router = express.Router();
const LeadsRoute = require("./leads.routes.js");
const ClientsRoute = require("./clients.routes.js");
const ProjectsRoute = require("./projects.routes.js");
const ReportsRoute = require("./reports.routes.js");
const fileUpload = require("../routes/fileupload.routes.js");

router.use("/leads", LeadsRoute);
router.use("/clients", ClientsRoute);
router.use("/projects", ProjectsRoute);
router.use("/reports", ReportsRoute);
/* 
  @route   POST /upload
  @desc    upload image
*/
router.use("/upload", fileUpload);

module.exports = router;
