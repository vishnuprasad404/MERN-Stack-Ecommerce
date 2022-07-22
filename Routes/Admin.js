const express = require("express");
const router = express.Router();
const db = require("../database_config");
const bcrypt = require("bcrypt");

//admin login start

router.post("/admin/signin", async (req, res) => {
  if (req.body) {
    let admin = await db
      .get()
      .collection(process.env.ADMIN_COLLECTION)
      .findOne({ username: req.body.username });

    if (admin) {
      bcrypt.compare(req.body.password, admin.password).then((result) => {
        if (result) {
          req.session.admin = true;
          res.send(true);
        } else {
          res.send(false);
        }
      });
    } else {
      res.send(false);
    }
  }
}); 

//admin login end

//admin logout start

router.get("/admin/logout", (req, res) => {
  req.session.destroy();
});

//admin logout end

module.exports = router;
