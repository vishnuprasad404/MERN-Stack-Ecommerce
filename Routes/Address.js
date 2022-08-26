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

      if (address) {
        res.json(address);
      } else {
        res.send(false);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/add/deliveryAddress", async (req, res) => {
  if (req.session.user) {
    req.body.user = ObjectId(req.session.user._id);
    db.get()
      .collection(process.env.ADDRESS_COLLECTION)
      .insertOne(req.body)
      .then(() => {
        res.send(true);
      });
  }
});

router.put("/update/deliveryAddress", async (req, res) => {
  if (req.session.user) {
    const {
      name,
      mobile,
      pincode,
      locality,
      address,
      district,
      state,
      landmark,
      altPhone,
    } = req.body;
    const currentAddress = await db
      .get()
      .collection(process.env.ADDRESS_COLLECTION)
      .findOne({ user: ObjectId(req.session.user._id) });

    if (currentAddress) {
      db.get()
        .collection(process.env.ADDRESS_COLLECTION)
        .updateOne(
          {
            user: ObjectId(req.session.user._id),
          },
          {
            $set: {
              name: name || currentAddress.name,
              state: state || currentAddress.state,
              mobile: mobile || currentAddress.mobile,
              address: address || currentAddress.address,
              pincode: pincode || currentAddress.pincode,
              locality: locality || currentAddress.locality,
              district: district || currentAddress.district,
              altPhone: altPhone || currentAddress.altPhone,
              landmark: landmark || currentAddress.landmark,
            },
          }
        )
        .then(() => {
          res.send(true);
        });
    }
  }
});

module.exports = router;
