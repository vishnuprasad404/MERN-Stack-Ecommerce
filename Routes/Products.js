const { ObjectID } = require("bson");
const express = require("express");
const router = express.Router();
const db = require("../database_config");

//get products start

router.get("/products", async (req, res) => {
  let products = await db
    .get()
    .collection(process.env.PRODUCTS_COLLECTION)
    .find()
    .toArray();
  if (products) {
    res.json(products);
  }
});

//get products end

//admin add product start

router.post("/admin/addproduct", (req, res) => {
  let image1 = req.files.image1;
  let image2 = req.files.image2;
  let image3 = req.files.image3;
  let image4 = req.files.image4;

  if (req.body) {
    if (image1) {
      image1.mv("public/uploads/" + image1.md5 + ".png", (err) => {});
    }
    if (image2) {
      image2.mv("public/uploads/" + image2.md5 + ".png", (err) => {});
    }
    if (image3) {
      image3.mv("public/uploads/" + image3.md5 + ".png", (err) => {});
    }
    if (image4) {
      image4.mv("public/uploads/" + image4.md5 + ".png", (err) => {});
    }

    db.get()
      .collection(process.env.PRODUCTS_COLLECTION)
      .insertOne({
        title: req.body.title,
        discountPrise: parseInt(req.body.disPrise),
        orginalPrise: parseInt(req.body.orgPrise),
        description: req.body.description,
        category: req.body.category,
        inStock: parseInt(req.body.inStock),
        image1: process.env.ORGIN + "/uploads/" + image1.md5 + ".png",
        image2: process.env.ORGIN + "/uploads/" + image2.md5 + ".png",
        image3: process.env.ORGIN + "/uploads/" + image3.md5 + ".png",
        image4: process.env.ORGIN + "/uploads/" + image4.md5 + ".png",
        reviews: [],
      })
      .then((response) => {
        if (response) {
          res.send(true);
        } else {
          res.send(false);
        }
      });
  }
});

// admin add product end

//admin remove products start//

router.delete("/admin/remove-product/:id", (req, res) => {
  db.get()
    .collection(process.env.PRODUCTS_COLLECTION)
    .deleteOne({ _id: ObjectID(req.params.id) })
    .then((result) => {
      if (result.deletedCount === 1) {
        res.status(200).send(true);
      } else {
        res.status(400).send(false);
      }
    });
});

//admin remove products end/

module.exports = router;
