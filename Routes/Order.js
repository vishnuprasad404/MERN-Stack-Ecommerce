const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const db = require("../database_config");
const crypto = require("crypto");
const Razorpay = require("razorpay");
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
            $project: {
              item: { $toObjectId: "$products.item" },
              order_id : "$order_id",
              quantity: "$products.quantity",
              prise: "$products.prise",
              status: "$status",
              created_at: "$created_at",
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
      res.json(orders);
    }
  } catch (error) {
    console.log(error);
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
        status: "pending",
        address: address,
        products: req.body,
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
          ).then(()=>{
            res.send(true)
          })
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

router.put("/place-order/:OrderId/:totalPrise/:paymentMethord", (req, res) => {
  try {
    if (req.session.user) {
      if (req.params.paymentMethord == "cod") {
        db.get()
          .collection(process.env.ORDERS_COLLECTION)
          .updateOne(
            {
              user: ObjectId(req.session.user._id),
              _id: ObjectId(req.params.OrderId),
            },
            {
              $set: { status: "placed", payment_methord: "cod" },
            }
          )
          .then((result) => {
            if (result) {
              res.send({ status: "placed" });
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
});

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
              $set: { status: "placed", payment_methord: "online" },
            }
          )
          .then((result) => {
            if (result) {
              res.send({ paymentVerified: true });
            }
          });
      } else {
        res.send({ paymentVerified: false });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
