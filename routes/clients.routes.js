const router = require("express").Router();
const { Client } = require("../models");

/**
 * @route		POST /client
 * @desc		Insert client service records
 * @body
 */

router.post("/", async (req, res, next) => {
  let phoneNumber = req.body.phone.slice(-10);
  const clients = await Client.find();
  let registered = false;
  clients.map((client) => {
    if (
      String(client.phone).slice(-10) == phoneNumber ||
      String(client.phone2).slice(-10) == phoneNumber
    ) {
      registered = true;
    }
  });

  if (registered == true) {
    return res.status(500).json({ message: "Client already registered" });
  }
  new Client(req.body)
    .save()
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Client  Saved" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route		GET /client
 * @desc		Fetch client service records
 */

router.get("/", (req, res, next) => {
  let query = {};
  if ("_id" in req.query) query._id = { $in: req.query._id.split(",") };
  if ("createdBy" in req.query) query.createdBy = req.query.createdBy;
  if ("email" in req.query) query.email = req.query.email;
  if ("phone" in req.query) query.phone = req.query.phone;

  Client.find(query)
    .populate("createdBy")
    .exec()
    .then((doc) => {
      res.status(200).json({ data: doc });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

/**
 * @route		PUT /client/:client_id
 * @desc		Edit client records
 */

router.put("/:client_id", async (req, res, next) => {
  let phoneNumber = req.body.phone.slice(-10);
  const clients = await Client.find();
  let registered = false;

  clients.map((client) => {
    if (
      String(client.phone).slice(-10) == phoneNumber ||
      String(client.phone2).slice(-10) == phoneNumber
    ) {
      registered = true;
    }
  });
  if (registered == true) {
    return res.status(500).json({ message: "Client already registered" });
  }

  Client.findByIdAndUpdate(req.params.client_id, { ...req.body }, { new: true })
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Client Changed" });
    })
    .catch((error) => {
      if (error.name === "MongoServerError" && error.code === 11000) {
        return res.status(500).json({ message: "Client already registered." });
      }
      return res.status(500).json({ message: error.message });
    });
});

/**
 * @route		DELETE /client/:client_id
 * @desc		DELETE client record
 */

router.delete("/:client_id", (req, res, next) => {
  Client.findByIdAndDelete(req.params.client_id)
    .then((doc) => {
      res.status(200).json({ data: doc, message: "Client  Deleted" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
