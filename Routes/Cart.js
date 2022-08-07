const express = require("express");
const router = express.Router();
const db = require("../database_config");
const ObjectId = require("mongodb").ObjectId;

router.post("/addtocart", async (req, res) => {
  try {
    let productObj = {
      item: ObjectId(req.body.pid),
      prise: req.body.prise,
      quantity: 1,
    };

    if (req.session.user) {
      let userCart = await db
        .get()
        .collection(process.env.CART_COLLECTION)
        .findOne({ user: ObjectId(req.session.user._id) });

      if (userCart) {
        let productExist = userCart.products.findIndex((product) => {
          return product.item == req.body.pid;
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
                  products: productObj,
                },
              }
            )
            .then((result) => {
              if (result) {
                res.send({ itemAdded: true });
              }
            });
        } else {
          res.send({ inCart: true });
        }
      } else {
        db.get()
          .collection(process.env.CART_COLLECTION)
          .insertOne({
            user: ObjectId(req.session.user._id),
            products: [productObj],
          })
          .then((response) => {
            if (response) {
              res.send({ itemAdded: true });
            }
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// get Cart products start

router.get("/getcartproducts", async (req, res) => {
  try {
    if (req.session.user) {
      let cartItems = await db
        .get()
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
        .toArray();
      res.json(cartItems);
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
