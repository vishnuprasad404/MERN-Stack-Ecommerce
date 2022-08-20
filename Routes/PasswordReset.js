const router = require("express").Router();
const nodemailer = require("nodemailer");
const db = require("../database_config");
const ObjectId = require("mongodb").ObjectId;
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

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
  }
});

router.get("/user/check/password-reset/token/:userId/:token", (req, res) => {
  const { userId, token } = req.params;
  db.get()
    .collection(process.env.PASSWORD_RESET_COLLECTION)
    .findOne({ userId: ObjectId(userId) })
    .then((result) => {
      if (result) {
        bcrypt.compare(token, result.token).then((isValid) => {
          if (isValid) {
            res.send(true);
          } else {
            res.send(false);
          }
        });
      }else{
        res.send(false)
      }
    });
});

router.post("/user/password-reset", (req, res) => {
  const { email } = req.body;
  db.get()
    .collection(process.env.USERS_COLLECTION)
    .findOne({
      email: email,
    })
    .then((result) => {
      if (result) {
        if (result.verified !== true) {
          res.json({
            message: "This Email is not verified please verify",
            status: "WARNING",
          });
        } else {
          // create a unique token for password reset //
          const Token = uuidv4() + result._id;
          // end

          // store token in database for feature comparison //
          bcrypt.hash(Token, 10).then((HashedToken) => {
            db.get()
              .collection(process.env.PASSWORD_RESET_COLLECTION)
              .insertOne({
                userId: ObjectId(result._id),
                token: HashedToken,
                created_at: Date.now(),
                expired_at: Date.now() + 900000,
              })
              .then(() => {
                // send verification link to user gmail
                const mailOptions = {
                  from: process.env.AUTH_EMAIL,
                  to: email,
                  subject: "Password Reset",
                  html: `<p>Someone requested a password reset for your account ${
                    result.email
                  } on ecart <br/> if you did not request a password reset,please ignore this mail.<br/><br/> click the following link to reset your password: <br/> <a href=${
                    process.env.ORIGIN +
                    "/user/password-reset/create-password/" +
                    result._id +
                    "/" +
                    Token
                  }>${
                    process.env.ORIGIN +
                    "/user/password-reset/create-password/" +
                    result._id +
                    "/" +
                    Token
                  }</a> <br/><br/> This link is valid for 15 minutes  </p> </p>`,
                };
                transporter
                  .sendMail(mailOptions)
                  .then((maild) => {
                    res.json({
                      message:
                        "A email has been send to your email account. with instruction to reset your password",
                      status: "SUCCESS",
                    });
                  })
                  .catch(() => {
                    res.json({
                      message: "Network issue try again!",
                      status: "FAILED",
                    });
                  });

                //end
              });
          });
          //end
        }
      } else {
        res.json({
          message: "Email is not registerd please signup!",
          status: "FAILED",
        });
      }
    });
});

router.post("/user/verify/password-reset", (req, res) => {
  const { userId, Token, newPassword } = req.body;
  if (userId && Token && newPassword) {
    db.get()
      .collection(process.env.PASSWORD_RESET_COLLECTION)
      .findOne({
        userId: ObjectId(userId),
      })
      .then((result) => {
        if (result) {
          if (result.expired_at < Date.now()) {
            db.get()
              .collection(process.env.PASSWORD_RESET_COLLECTION)
              .deleteOne({ _id: ObjectId(result._id) })
              .then(() => res.send({ isValidToken: false }));
          } else {
            bcrypt.compare(Token, result.token).then((validToken) => {
              if (validToken) {
                // hash new password and store in database...//
                bcrypt.hash(newPassword, 10).then((HashedPassword) => {
                  db.get()
                    .collection(process.env.USERS_COLLECTION)
                    .updateOne(
                      {
                        _id: ObjectId(userId),
                      },
                      {
                        $set: { password: HashedPassword },
                      }
                    )
                    .then(() => {
                      db.get()
                        .collection(process.env.PASSWORD_RESET_COLLECTION)
                        .deleteOne({ _id: ObjectId(result._id) });
                      res.json({
                        message: "Password changed successfully",
                        status: "SUCCESS",
                      });
                    })
                    .catch(() => {
                      res.json({
                        message: "Password cannot be changed!",
                        status: "FAILED",
                      });
                    });
                });
                //end
              } else {
                res.json({
                  message: "Invalid access token!",
                  status: "FAILED",
                });
              }
            });
          }
        } else {
          res.json({
            message: "Invalid access token!",
            status: "FAILED",
          });
        }
      });
  }
});

module.exports = router;
