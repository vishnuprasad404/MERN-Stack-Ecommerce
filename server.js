const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
require("dotenv").config();
const path = require("path");
const cors = require("cors");
// const fileUpload = require("express-fileupload");
const database = require("./database_config");
//database connection
database.connect();
//
const cookieParser = require("cookie-parser");
const session = require("express-session");
const Admin = require("./Routes/Admin");
const Users = require("./Routes/Users");
const Products = require("./Routes/Products");
const Cart = require("./Routes/Cart");
const Order = require("./Routes/Order");
const Favorites = require("./Routes/Favorites");
const Address = require("./Routes/Address");
const Reviews = require("./Routes/Reviews");
const PasswordReset = require("./Routes/PasswordReset");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://ecartonline.herokuapp.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// app.use(fileUpload());
app.use(cookieParser());
app.use(
  session({
    secret: "hello",
    cookie: {},
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static("public"));
app.use("/api", Admin);
app.use("/api", Users);
app.use("/api", Products);
app.use("/api", Favorites);
app.use("/api", Cart);
app.use("/api", Order);
app.use("/api", Address);
app.use("/api", Reviews);
app.use("/api", PasswordReset);

//get admin
app.get("/api/admin", (req, res) => {
  res.json({
    isLoggedIn: req.session.admin,
  });
});
//

//get User
app.get("/api/user", (req, res) => {
  if (req.session.user) {
    res.json({
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user,
    });
  } else {
    res.send(false);
  }
});
//

//serve react app page //

app.use(express.static(path.join(__dirname, "./frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build", "index.html"));
});

//serve react app page //

app.listen(PORT);
