const express = require("express");
const router = express.Router();
const db = require("../database_config");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

// email verification //

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("succes ");
  }
});

//end

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
            verified: false,
            created_at: new Date(),
          })
          .then((result) => {
            // handle email varification //
            sendVerfificationMain(result.insertedId, req.body.email, res);
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

// send verfication mail handler function //

const sendVerfificationMain = (id, email, res) => {
  console.log(id);
  console.log(email);
  // console.log(res);

  let uniqueStr = uuidv4() + id;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verfy your email",
    html: `<p>Verify your email to complete the signup <p>this link expires in 6hour</p> <p><a href=${
      process.env.ORGIN + "/api/user/verify/" + id + "/" + uniqueStr
    } >click to verify</a></p> </p>`,
  };

  const saltRound = 10;
  bcrypt
    .hash(uniqueStr, saltRound)
    .then((hashedStr) => {
      db.get()
        .collection(process.env.VERIFICATION_COLLECTION)
        .insertOne({
          userId: id,
          uniqueStr: hashedStr,
          created_at: Date.now(),
          expires_at: Date.now() + 120000,
        })
        .then(() => {
          transporter.sendMail(mailOptions);
        })
        .catch((er) => {
          console.log(er);
        });
    })
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "An error occured",
      });
    });
};

//end

// verify email /

router.get("/user/verify/:id/:uniquStr", async (req, res) => {
  let isVerificationProgress = await db
    .get()
    .collection(process.env.VERIFICATION_COLLECTION)
    .findOne({ userId: ObjectId(req.params.id) });
  console.log(isVerificationProgress);
  if (isVerificationProgress) {
    res.json({ status: "PENDING" });
    if (isVerificationProgress.expires_at < Date.now()) {
      // expire verifivcation link //
      db.get()
        .collection(process.env.VERIFICATION_COLLECTION)
        .deleteOne({
          userId: ObjectId(req.params.id),
        });
    } else {
      bcrypt
        .compare(req.params.uniquStr, isVerificationProgress.uniqueStr)
        .then((result) => {
          if (result) {
            // link is valid
            db.get()
              .collection(process.env.USERS_COLLECTION)
              .updateOne(
                {
                  _id: ObjectId(req.params.id),
                },
                {
                  $set: { verified: true },
                }
              )
              .then(() => {
                db.get()
                  .collection(process.env.VERIFICATION_COLLECTION)
                  .deleteOne({
                    userId: ObjectId(req.params.id),
                  });
              });
          } else {
            //link is not valid
          }
        })
        .catch(() => {
          console.log("not valid link and cant find user ");
        });
    }
  } else {
    res.json({ status: "TimeOUT" });
  }
});

//end

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
              req.session.user.username = req.body.username;
              req.session.user.email = req.body.email;
              req.session.user.phone = req.body.phone;

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
          };
          db.get()
            .collection(process.env.USERS_COLLECTION)
            .updateOne(
              {
                _id: ObjectId(req.session.user._id),
              },
              {
                $set: updatedInfo,
              }
            )
            .then((result) => {
              if (result) {
                req.session.user = updatedInfo;
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
