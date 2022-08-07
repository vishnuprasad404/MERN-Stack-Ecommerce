const express = require("express");
const router = express.Router();
const db = require("../database_config");
const ObjectId = require("mongodb").ObjectId;

router.post("/addtofavorites", async (req, res) => {
  try {
    if (req.session.user) {
      let proObj = {
        item: ObjectId(req.body.item),
      };
      let favExist = await db
        .get()
        .collection(process.env.FAVORITES_COLLECTION)
        .findOne({
          user: ObjectId(req.session.user._id),
        });

      if (favExist) {
        let productExist = favExist.products.findIndex((product) => {
          return product.item == req.body.item;
        });

        if (productExist === -1) {
          db.get()
            .collection(process.env.FAVORITES_COLLECTION)
            .updateOne(
              {
                user: ObjectId(req.session.user._id),
              },
              {
                $push: { products: proObj },
              }
            )
            .then((result) => {
              res.send({ itemAdded: true });
            });
        } else {
          res.send({ itemExist: true });
        }
      } else {
        db.get()
          .collection(process.env.FAVORITES_COLLECTION)
          .insertOne({
            user: ObjectId(req.session.user._id),
            products: [proObj],
          })
          .then((result) => {
            if (result) {
              res.send({ itemAdded: true });
            }
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/getfavorites", async (req, res) => {
  try {
    if (req.session.user) {
      let favProducts = await db
        .get()
        .collection(process.env.FAVORITES_COLLECTION)
        .aggregate([
          {
            $match: { user: ObjectId(req.session.user._id) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
            },
          },
          {
            $lookup: {
              from: process.env.PRODUCTS_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
        ])
        .toArray();

      res.send(favProducts);
    }
  } catch (error) {}
});

router.delete("/removefavoriteitem/:id", (req, res) => {
  try {
    if (req.session.user) {
      db.get()
        .collection(process.env.FAVORITES_COLLECTION)
        .updateOne(
          {
            user: ObjectId(req.session.user._id),
          },
          {
            $pull: { products: { item: ObjectId(req.params.id) } },
          }
        )
        .then((result) => {
          if (result) {
            res.send(true);
          }
        });
    }
  } catch (error) {}
});

module.exports = router;
