const express = require("express");
const router = express.Router();
const db = require("../database_config");
const ObjectId = require("mongodb").ObjectId;

//get products start

router.get("/products", (req, res) => {
  try {
    db.get()
      .collection(process.env.PRODUCTS_COLLECTION)
      .aggregate([
        {
          $project: {
            title: "$title",
            discountPrise: "$discountPrise",
            orginalPrise: "$orginalPrise",
            description: "$description",
            category: "$category",
            inStock: "$inStock",
            image1: "$image1",
            image2: "$image2",
            image3: "$image3",
            image4: "$image4",
            reviews: "$reviews",
            total_reviews: { $sum: { $size: "$reviews.feedback" } },
            total_ratings: { $avg: "$reviews.rating" },
          },
        },
      ])
      .toArray()
      .then((result) => {
        res.json(result);
      });
  } catch (error) {
    res.send("Network issue");
  }
});

//get products end

//admin add product start

router.post("/admin/addproduct", (req, res) => {
  try {
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
          image1: process.env.BASE_URL + "/uploads/" + image1.md5 + ".png",
          image2: process.env.BASE_URL + "/uploads/" + image2.md5 + ".png",
          image3: process.env.BASE_URL + "/uploads/" + image3.md5 + ".png",
          image4: process.env.BASE_URL + "/uploads/" + image4.md5 + ".png",
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
  } catch (error) {
    console.log(error);
  }
});

// admin add product end

//admin update products start//

router.put("/admin/update-product/:id", (req, res) => {
  try {
    if (req.files) {
      let image1 = req.files.image1;
      let image2 = req.files.image2;
      let image3 = req.files.image3;
      let image4 = req.files.image4;
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

      let updateObject = {
        title: req.body.title,
        discountPrise: parseInt(req.body.disPrise),
        orginalPrise: parseInt(req.body.orgPrise),
        description: req.body.description,
        category: req.body.category,
        inStock: parseInt(req.body.inStock),
        image1: process.env.BASE_URL + "/uploads/" + image1.md5 + ".png",
        image2: process.env.BASE_URL + "/uploads/" + image2.md5 + ".png",
        image3: process.env.BASE_URL + "/uploads/" + image3.md5 + ".png",
        image4: process.env.BASE_URL + "/uploads/" + image4.md5 + ".png",
      };
      db.get()
        .collection(process.env.PRODUCTS_COLLECTION)
        .updateOne(
          { _id: ObjectId(req.params.id) },
          {
            $set: updateObject,
          }
        )
        .then(() => {
          res.status(200).send(true);
        });
    } else {
      db.get()
        .collection(process.env.PRODUCTS_COLLECTION)
        .updateOne(
          { _id: ObjectId(req.params.id) },
          {
            $set: req.body,
          }
        )
        .then(() => {
          res.status(200).send(true);
        });
    }
  } catch (error) {
    console.log(error);
  }
});

//admin update products end//

//admin remove products start//

router.delete("/admin/remove-product/:id/", (req, res) => {
  try {
    db.get()
      .collection(process.env.PRODUCTS_COLLECTION)
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        if (result.deletedCount === 1) {
          res.status(200).send(true);
        } else {
          res.status(400).send(false);
        }
      });
  } catch (error) {
    console.log(error);
  }
});

//admin remove products end/

module.exports = router;
