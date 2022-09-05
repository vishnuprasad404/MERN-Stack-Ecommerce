const express = require("express");
const router = express.Router();
const db = require("../database_config");
const ObjectId = require("mongodb").ObjectId;
const multer = require("multer");
const sharp = require("sharp");

// multer file upload config start //

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  },
});

var uploads = multer({ storage: storage });

// multer file upload config end //

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
            thumbnail: "$thumbnail",
            images: "$images",
            reviews: "$reviews",
            total_reviews: { $sum: { $size: "$reviews.feedback" } },
            total_ratings: { $avg: "$reviews.rating" },
            created_at: "$created_at",
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

router.post("/admin/addproduct", uploads.array("images", 4), (req, res) => {
  const files = req.files.length;
  if (files > 1 && files < 4) {
    // resize image //
    const resizableFile = req.files[0].filename;
    sharp(`public/uploads/${resizableFile}`)
      .resize({ width: 300 })
      .toFormat("jpeg")
      .jpeg({ quality: 100, chromaSubsampling: "4:4:4" })
      .toFile(`public/thumb/${resizableFile}`)
      .then(() => {
        // change images array to url//
        const images = req.files.map((item) => {
          return `${process.env.BASE_URL}/uploads/${item.filename}`;
        });
        //
        db.get()
          .collection(process.env.PRODUCTS_COLLECTION)
          .insertOne({
            title: req.body.title,
            discountPrise: parseInt(req.body.disPrise),
            orginalPrise: parseInt(req.body.orgPrise),
            description: req.body.description,
            category: req.body.category,
            inStock: parseInt(req.body.inStock),
            thumbnail: process.env.BASE_URL + "/thumb/" + req.files[0].filename,
            images: images,
            created_at: new Date(),
            reviews: [],
          })
          .then(() => {
            res.json({
              message: "Product added succesfully",
              status: "SUCCESS",
            });
          })
          .catch(() => {
            res.json({
              message: "Network issue try again!",
              status: "FAILED",
            });
          });
      });
  } else {
    res.json({
      message: "A product contain minimum and maximum four images",
      status: "FAILED",
    });
  }
});

// admin add product end

//admin update products start//

router.put(
  "/admin/update-product/:id",
  uploads.array("images", 4),
  (req, res) => {
    const { id } = req.params;
    const { title, orgPrise, disPrise, inStock, description, category } =
      req.body;
    const files = req.files.length;
    var thumbnailImage;
    var images = [];

    if (files > 0) {
      // resize image //
      const resizableFile = req.files[0].filename;
      sharp(`public/uploads/${resizableFile}`)
        .resize({ width: 300 })
        .toFormat("jpeg")
        .jpeg({ quality: 100, chromaSubsampling: "4:4:4" })
        .toFile(`public/thumb/${resizableFile}`)
        .then(() => {
          // change images array to url//
          images = req.files.map((item) => {
            return `${process.env.BASE_URL}/uploads/${item.filename}`;
          });
        });
      thumbnailImage = process.env.BASE_URL + "/thumb/" + req.files[0].filename;
    }
    db.get()
      .collection(process.env.PRODUCTS_COLLECTION)
      .findOne({ _id: ObjectId(id) })
      .then((product) => {
        db.get()
          .collection(process.env.PRODUCTS_COLLECTION)
          .updateOne(
            {
              _id: ObjectId(id),
            },
            {
              $set: {
                title: title || product.title,
                inStock: inStock || product.inStock,
                orginalPrise: orgPrise || product.orginalPrise,
                discountPrise: disPrise || product.discountPrise,
                category: category || product.category,
                description: description || product.description,
                thumbnail: thumbnailImage || product.thumbnail,
                images: [
                  images[0] || product.images[0],
                  images[1] || product.images[1],
                  images[2] || product.images[2],
                ],
              },
            }
          )
          .then((result) => {
            if (!result) {
              return res.json({
                message: "Failed to update product!",
                status: "FAILED",
              });
            }
            res.json({
              message: "Product Updated Successfully",
              status: "SUCCESS",
            });
          });
      });
  }
);

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
