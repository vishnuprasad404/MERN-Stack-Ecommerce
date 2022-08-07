const router = require("express").Router();
const db = require("../database_config");
const ObjectId = require("mongodb").ObjectId;

router.get("/user/review/:id", async (req, res) => {
  try {
    if (req.session.user) {
      let review = await db
        .get()
        .collection(process.env.PRODUCTS_COLLECTION)
        .aggregate([
          {
            $match: {
              _id: ObjectId(req.params.id),
            },
          },
          {
            $unwind: "$reviews",
          },
          {
            $match: { "reviews.uid": ObjectId(req.session.user._id) },
          },
          {
            $project: {
              rating: "$reviews.rating",
              feedback: "$reviews.feedback",
            },
          },
        ])
        .toArray();
      res.status(200).json(review[0]);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-all-reviews/:id", async (req, res) => {
  try {
    let review = await db
      .get()
      .collection(process.env.PRODUCTS_COLLECTION)
      .aggregate([
        {
          $match: { _id: ObjectId(req.params.id) },
        },
        {
          $project: {
            total_reviews: { $sum: { $size: "$reviews.feedback" } },
            total_ratings: {
              $divide: [{ $sum: "$reviews.rating" }, { $size: "$reviews" }],
            },
            userRatings: "$reviews",
          },
        },
      ])
      .toArray();
    res.json(review[0]);
  } catch (error) {
    res.send(false);
  }
});

router.post("/add-review", async (req, res) => {
  try {
    if (req.session.user) {
      let isReview = await db
        .get()
        .collection(process.env.PRODUCTS_COLLECTION)
        .find({ "reviews.uid": ObjectId(req.session.user._id) })
        .toArray();
      if (isReview.length >= 1) {
        if (req.body.feedback && req.body.rating) {
          db.get()
            .collection(process.env.PRODUCTS_COLLECTION)
            .updateOne(
              {
                _id: ObjectId(req.body.id),
                "reviews.uid": ObjectId(req.session.user._id),
              },
              {
                $set: {
                  "reviews.$.feedback": req.body.feedback,
                  "reviews.$.rating": parseInt(req.body.rating),
                },
              }
            )
            .then((result) => {
              console.log(result);
            });
        }
      } else {
        let reviewObj = {
          uid: ObjectId(req.session.user._id),
          user: req.session.user.username,
          rating: parseInt(req.body.rating),
          feedback: req.body.feedback,
        };
        db.get()
          .collection(process.env.PRODUCTS_COLLECTION)
          .updateOne(
            {
              _id: ObjectId(req.body.id),
            },
            {
              $push: {
                reviews: reviewObj,
              },
            }
          )
          .then(() => {
            res.json({
              reviewUpdated: true,
            });
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
