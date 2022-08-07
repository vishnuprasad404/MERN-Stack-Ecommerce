const express = require("express");
const router = express.Router();
const db = require("../database_config");
const ObjectId = require("mongodb").ObjectId;

router.get("/getshippingaddress", async (req, res) => {
  try {
    if (req.session.user) {
      let address = await db
        .get()
        .collection(process.env.ADDRESS_COLLECTION)
        .findOne({ user: ObjectId(req.session.user._id) });

      res.json(address);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/addshippingaddress", async (req, res) => {
  try {
    if (req.session.user) {
      let addressExist = await db
        .get()
        .collection(process.env.ADDRESS_COLLECTION)
        .findOne({ user: ObjectId(req.session.user._id) });

      if (!addressExist) {
        req.body.user = ObjectId(req.session.user._id);
        db.get()
          .collection(process.env.ADDRESS_COLLECTION)
          .insertOne(req.body)
          .then(() => {
            res.send(true);
          });
      } else {
        db.get()
          .collection(process.env.ADDRESS_COLLECTION)
          .updateOne(
            {
              user: ObjectId(req.session.user._id),
            },
            {
              $set: req.body,
            }
          )
          .then(() => {
            res.send(true);
          });
      }
    }
  } catch (error) {
    console.log(err);
  }
});

module.exports = router;
