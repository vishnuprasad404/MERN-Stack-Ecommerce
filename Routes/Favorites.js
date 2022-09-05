const express = require("express");
const router = express.Router();
const db = require("../database_config");
const ObjectId = require("mongodb").ObjectId;

router.post("/addtofavorites", async (req, res) => {
  const { pid } = req.body;
  if (req.session.user) {
    db.get()
      .collection(process.env.FAVORITES_COLLECTION)
      .findOne({ user: ObjectId(req.session.user._id) })
      .then((result) => {
        if (!result) {
          db.get()
            .collection(process.env.FAVORITES_COLLECTION)
            .insertOne({
              user: ObjectId(req.session.user._id),
              products: [{ item: ObjectId(pid) }],
            });
        } else {
          const favExist = result.products.findIndex((product) => {
            return product.item == pid;
          });
          if (favExist === -1) {
            db.get()
              .collection(process.env.FAVORITES_COLLECTION)
              .updateOne(
                {
                  user: ObjectId(req.session.user._id),
                },
                {
                  $push: { products: { item: ObjectId(pid) } },
                }
              )
              .then(() => {
                res.json({
                  message: "Item added to your wishlist",
                  status: "SUCCESS",
                });
              })
              .catch(() => {
                res.json({
                  message: "Network error!",
                  status: "FAILED",
                });
              });
          } else {
            res.json({
              message: "Item already in your wishlist!",
              status: "WARNING",
            });
          }
        }
      })
      .catch((err) => {
        res.send(err);
      });
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
          {
            $unwind: "$product",
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
