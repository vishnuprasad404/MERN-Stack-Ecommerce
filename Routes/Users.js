const express = require("express");
const router = express.Router();
const db = require("../database_config");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

// get all users//

router.get("/admin/get-all-user", async (req, res) => {
  try {
    let user = await db
      .get()
      .collection(process.env.USERS_COLLECTION)
      .aggregate([
        {
          $project: {
            username: "$username",
            email: "$email",
            phone: "$phone",
            created_at: "$created_at",
          },
        },
      ])
      .toArray();

    if (user) {
      res.json(user);
    }
  } catch (error) {
    console.log(error);
  }
});

// get all users//

// add user to database start

router.post("/user/signup", async (req, res) => {
  try {
    if (req.body) {
      let userExist = await db
        .get()
        .collection(process.env.USERS_COLLECTION)
        .findOne({ email: req.body.email });
      if (!userExist) {
        const hasedPassword = await bcrypt.hash(req.body.password, 10);
        db.get()
          .collection(process.env.USERS_COLLECTION)
          .insertOne({
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            password: hasedPassword,
          })
          .then(async (response) => {
            if (response) {
              let Reguser = await db
                .get()
                .collection(process.env.USERS_COLLECTION)
                .findOne({ email: req.body.email });
              req.session.user = Reguser;
              req.session.isLoggedIn = true;
              res.send({
                isUserAdded: true,
                user: req.session.user,
              });
            } else {
              res.send({
                isUserAdded: false,
              });
            }
          });
      } else {
        res.send({ userExist: true });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// add user to database end

// login as user start

router.post("/user/signin", async (req, res) => {
  try {
    if (req.body) {
      let user = await db
        .get()
        .collection(process.env.USERS_COLLECTION)
        .findOne({ email: req.body.email });
      if (user) {
        bcrypt.compare(req.body.password, user.password).then((result) => {
          if (result) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            res.send({
              isLoggedIn: true,
              user: req.session.user,
            });
          } else {
            res.send({ isLoggedIn: false });
          }
        });
      } else {
        res.send({ userFound: false });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// login as user end

router.post("/updateaccount", async (req, res) => {
  try {
    if (req.session.user) {
      if (!req.body.current_password) {
        db.get()
          .collection(process.env.USERS_COLLECTION)
          .updateOne(
            {
              _id: ObjectId(req.session.user._id),
            },
            {
              $set: req.body,
            }
          )
          .then((result) => {
            if (result) {
              req.session.user.username = req.body.username
              req.session.user.email = req.body.email
              req.session.user.phone = req.body.phone

              res.send({ updated: true });
            } else {
              res.send({ updated: false });
            }
          });
      } else {
        let matchCurrentPass = await bcrypt.compare(
          req.body.current_password,
          req.session.user.password
        );

        if (matchCurrentPass === true) {
          let hashedPasswd = await bcrypt.hash(req.body.new_password, 10);
          let updatedInfo = {
            username: req.body.username,
            phone: req.body.phone,
            email: req.body.email,
            password: hashedPasswd,
          }
          db.get()
            .collection(process.env.USERS_COLLECTION)
            .updateOne(
              {
                _id: ObjectId(req.session.user._id),
              },
              {
                $set: updatedInfo
              }
            )
            .then((result) => {
              if (result) {
                req.session.user = updatedInfo
                res.send({ updated: true });
                req.session.destroy();
              } else {
                res.send({ updated: false });
              }
            });
        } else {
          res.send({ passMatched: false });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// user sign out start

router.get("/signout", (req, res) => {
  try {
    req.session.destroy();
    if (!req.session) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.log(error);
  }
});

// user sign out end

router.delete("/admin/delete-user/:id", (req, res) => {
  try {
    db.get()
      .collection(process.env.USERS_COLLECTION)
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        if (result.deletedCount === 1) {
          res.send(true);
        } else {
          res.send(false);
        }
      });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
