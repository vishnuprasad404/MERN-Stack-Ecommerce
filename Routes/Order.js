const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const db = require("../database_config");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { pid } = require("process");
let instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//admin get all orders route start

router.get("/admin/orders", async (req, res) => {
  try {
    let orders = await db
      .get()
      .collection(process.env.ORDERS_COLLECTION)
      .aggregate([
        {
          $match: {
            $and: [
              {
                $or: [
                  { status: "placed" },
                  { status: "dispatched" },
                  { status: "completed" },
                  { status: "cancelled" },
                ],
              },
            ],
          },
        },
        {
          $unwind: "$products",
        },
        {
          $project: {
            username: "$username",
            created_at: "$created_at",
            status: "$status",
            address: "$address",
            payment_methord: "$payment_methord",
            pid: { $toObjectId: "$products.item" },
            quantity: "$products.quantity",
            prise: "$products.prise",
          },
        },
        {
          $lookup: {
            from: process.env.PRODUCTS_COLLECTION,
            localField: "pid",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
      ])
      .toArray();

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
  }
});

//admin get all orders route end

//admin change order status route start//

router.put("/admin/change-order-status/:id/:status", (req, res) => {
  try {
    db.get()
      .collection(process.env.ORDERS_COLLECTION)
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { status: req.params.status },
        }
      )
      .then(() => {
        res.status(200).json({ status: req.params.status });
      });
  } catch (error) {
    console.log(error);
  }
});

router.get("/user/get-orders", async (req, res) => {
  try {
    if (req.session.user) {
      let orders = await db
        .get()
        .collection(process.env.ORDERS_COLLECTION)
        .aggregate([
          {
            $match: { user: ObjectId(req.session.user._id) },
          },
          {
            $unwind: "$products",
          },
          {
            $lookup: {
              from: process.env.PRODUCTS_COLLECTION,
              localField: "products.item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              order_id: "$order_id",
              item: "$products.item",
              product: "$product",
              quantity: "$products.quantity",
              prise: "$products.prise",
              status: "$products.status",
              created_at: "$created_at",
            },
          },
          {
            $unwind: "$product",
          },
        ])
        .toArray();
      res.json(orders);
    }
  } catch (error) {
    console.log("cannot get orders");
  }
});

router.get("/get-order/:order_id", async (req, res) => {
  try {
    if (req.session.user) {
      let order = await db
        .get()
        .collection(process.env.ORDERS_COLLECTION)
        .aggregate([
          {
            $match: {
              user: ObjectId(req.session.user._id),
              order_id: req.params.order_id,
            },
          },
          {
            $project: {
              user: "$user",
              username: "$username",
              order_total: { $sum: "$products.prise" },
              items: "$products",
            },
          },
          {
            $unwind: "$items",
          },
          {
            $project: {
              user: "$user",
              username: "$username",
              order_total: "$order_total",
              item: { $toObjectId: "$items.item" },
              prise: "$items.prise",
              quantity: "$items.quantity",
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
      res.json(order);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/create-order", async (req, res) => {
  try {
    if (req.session.user) {
      let products = req.body.map((data) => {
        let proObj = {
          item: ObjectId(data.item),
          quantity: data.quantity,
          prise: data.prise,
          status: "pending",
        };
        return proObj;
      });
      const orderID = crypto.randomBytes(16).toString("hex");
      let address = await db
        .get()
        .collection(process.env.ADDRESS_COLLECTION)
        .findOne({ user: ObjectId(req.session.user._id) });

      let orderObj = {
        user: ObjectId(req.session.user._id),
        username: req.session.user.username,
        order_id: orderID,
        created_at: new Date(),
        address: address,
        products: products,
      };
      db.get()
        .collection(process.env.ORDERS_COLLECTION)
        .insertOne(orderObj)
        .then((result) => {
          if (result) {
            res.send({ OrderId: orderObj.order_id });
          }
        });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put(
  "/change-order-item-quantity/:OrderId/:itemId/:prise/:quantity",
  (req, res) => {
    try {
      if (req.session.user) {
        db.get()
          .collection(process.env.ORDERS_COLLECTION)
          .updateOne(
            {
              user: ObjectId(req.session.user._id),
              _id: ObjectId(req.params.OrderId),
              "products.item": req.params.itemId,
            },
            {
              $set: {
                "products.$.prise": parseInt(req.params.prise),
                "products.$.quantity": parseInt(req.params.quantity),
              },
            }
          )
          .then(() => {
            res.send(true);
          });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.delete("/remove-checkout-item/:OrderId/:ItemId", (req, res) => {
  try {
    if (req.session.user) {
      db.get()
        .collection(process.env.ORDERS_COLLECTION)
        .updateOne(
          {
            user: ObjectId(req.session.user._id),
            _id: ObjectId(req.params.OrderId),
          },
          {
            $pull: { products: { item: req.params.ItemId } },
          }
        );
    }
  } catch (error) {
    console.log(error);
  }
});

router.put(
  "/place-order/:OrderId/:totalPrise/:paymentMethord",
  async (req, res) => {
    try {
      if (req.session.user) {
        if (req.params.paymentMethord == "cod") {
          db.get()
            .collection(process.env.ORDERS_COLLECTION)
            .updateMany(
              {
                user: ObjectId(req.session.user._id),
                _id: ObjectId(req.params.OrderId),
              },
              {
                $set: {
                  payment_methord: "cod",
                  "products.$[].status": "placed",
                },
              }
            )
            .then((result) => {
              if (result) {
                db.get()
                  .collection(process.env.ORDERS_COLLECTION)
                  .aggregate([
                    {
                      $match: { _id: ObjectId(req.params.OrderId) },
                    },
                    {
                      $unwind: "$products",
                    },
                    {
                      $project: {
                        item: "$products.item",
                        quantity: "$products.quantity",
                      },
                    },
                  ])
                  .forEach(async (pro) => {
                    let updateInStock = await db
                      .get()
                      .collection(process.env.PRODUCTS_COLLECTION)
                      .updateOne(
                        {
                          _id: pro.item,
                        },
                        {
                          $inc: { inStock: -pro.quantity },
                        }
                      );
                    if (updateInStock) {
                      res.json({
                        status: "placed",
                      });
                    }
                  });
              }
            });
        } else {
          instance.orders.create(
            {
              amount: parseInt(req.params.totalPrise) * 100,
              currency: "INR",
              receipt: req.params.OrderId,
            },
            (err, order) => {
              res.json({
                status: "pending",
                order,
              });
            }
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.post("/verify-online-payment", (req, res) => {
  try {
    if (req.session.user) {
      let payment_signature = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      );
      payment_signature.update(
        req.body.payment.razorpay_order_id +
          "|" +
          req.body.payment.razorpay_payment_id
      );
      payment_signature = payment_signature.digest("hex");

      if (req.body.payment.razorpay_signature == payment_signature) {
        db.get()
          .collection(process.env.ORDERS_COLLECTION)
          .updateOne(
            {
              user: ObjectId(req.session.user._id),
              _id: ObjectId(req.body.order.receipt),
            },
            {
              $set: {
                "products.$[].status": "placed",
                payment_methord: "online",
              },
            }
          )
          .then(() => {
            res.send({ paymentVerified: true });
            db.get()
              .collection(process.env.ORDERS_COLLECTION)
              .aggregate([
                {
                  $match: { _id: ObjectId(req.body.order.receipt) },
                },
                {
                  $unwind: "$products",
                },
                {
                  $project: {
                    item: "$products.item",
                    quantity: "$products.quantity",
                  },
                },
              ])
              .forEach((pro) => {
                db.get()
                  .collection(process.env.PRODUCTS_COLLECTION)
                  .updateOne(
                    {
                      _id: pro.item,
                    },
                    {
                      $inc: { inStock: -pro.quantity },
                    }
                  );
              });
          });
      } else {
        res.send({ paymentVerified: false });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// cancel order //

router.delete(
  "/user/cancel-order/:orderId/:pid/:quantity",
  async (req, res) => {
    try {
      if (req.session.user) {
        db.get()
          .collection(process.env.ORDERS_COLLECTION)
          .updateOne(
            {
              order_id: req.params.orderId,
              "products.item": ObjectId(req.params.pid),
            },
            {
              $set: {
                "products.$.status": "cancelled",
              },
            }
          )
          .then((result) => {
            if (result) {
              db.get()
                .collection(process.env.PRODUCTS_COLLECTION)
                .updateOne(
                  {
                    _id: ObjectId(req.params.pid),
                  },
                  {
                    $inc: { inStock: parseInt(req.params.quantity) },
                  }
                )
                .then((response) => {
                  if (response) {
                    res.send(true);
                  }
                });
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
