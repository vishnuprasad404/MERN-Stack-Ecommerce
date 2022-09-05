const express = require("express");
const router = express.Router();
const db = require("../database_config");
const ObjectId = require("mongodb").ObjectId;

router.post("/addtocart", async (req, res) => {
  const { pid, disPrise } = req.body;

  const product = {
    item: ObjectId(pid),
    prise: parseInt(disPrise), 
    quantity: 1,
  };

  if (req.session.user) {
    db.get()
      .collection(process.env.CART_COLLECTION)
      .findOne({ user: ObjectId(req.session.user._id) })
      .then((result) => {
        if (!result) {
          db.get()
            .collection(process.env.CART_COLLECTION)
            .insertOne({
              user: ObjectId(req.session.user._id),
              products: [product],
            })
            .then(() => {
              res.json({
                message: "Item added to your cart",
                status: "SUCCESS",
              });
            })
            .catch((err) => {
              res.json({
                message: error.message,
                status: "FAILED",
              });
            });
        } else {
          const productExist = result.products.findIndex((product) => {
            return product.item == pid;
          });
          if (productExist == -1) {
            db.get()
              .collection(process.env.CART_COLLECTION)
              .updateOne(
                {
                  user: ObjectId(req.session.user._id),
                },
                {
                  $push: {
                    products: product,
                  },
                }
              )
              .then((isAdded) => {
                if (isAdded) {
                  res.json({
                    message: "Item added to your cart",
                    status: "SUCCESS",
                  });
                } else {
                  res.json({
                    message: "Network Issue",
                    status: "FAILED",
                  });
                }
              });
          } else {
            res.json({
              message: "Item already in your cart!",
              status: "WARNING",
            });
          }
        }
      });
  }
});

// get Cart products start

router.get("/getcartproducts", (req, res) => {
  try {
    if (req.session.user) {
      db.get()
        .collection(process.env.CART_COLLECTION)
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
              prise: "$products.prise",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $unwind: "$product",
          },
        ])
        .toArray()
        .then((result) => {
          // console.log(result);
          res.json(result);
        });
    }
  } catch (error) {
    console.log(error);
  }
});

//get Cart Products end

// change cart item quantity start //

router.put("/managequantity/:cid/:pid/:quantity/:prise", (req, res) => {
  try {
    if (req.session.user) {
      db.get()
        .collection(process.env.CART_COLLECTION)
        .updateOne(
          {
            _id: ObjectId(req.params.cid),
            "products.item": ObjectId(req.params.pid),
          },
          {
            $set: {
              "products.$.quantity": parseInt(req.params.quantity),
              "products.$.prise": parseInt(req.params.prise),
            },
          }
        );
    }
  } catch (error) {
    console.log(error);
  }
});

// change cart item quantity end //

//delete cart item start

router.delete("/deletecartitem/:cid/:pid", (req, res) => {
  try {
    if (req.session.user) {
      db.get()
        .collection(process.env.CART_COLLECTION)
        .updateOne(
          {
            _id: ObjectId(req.params.cid),
          },
          {
            $pull: { products: { item: ObjectId(req.params.pid) } },
          }
        )
        .then((result) => {
          if (result) {
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

//delete cart item end

//get cart Total start

router.get("/getcarttotal", async (req, res) => {
  try {
    if (req.session.user) {
      let total = await db
        .get()
        .collection(process.env.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: ObjectId(req.session.user._id) },
          },
          {
            $project: {
              total_prise: {
                $sum: "$products.prise",
              },
            },
          },
        ])
        .toArray();
      res.send({ total: total[0].total_prise });
    }
  } catch (error) {
    console.log(error);
  }
});

//get cart Total end

module.exports = router;
