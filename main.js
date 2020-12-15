const cors = require("cors");
const express = require("express");
const app = express();
const connection = require("./database_connection");
var User = require("./user_model.js");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

const port = 4000;
app.use(cors());
connection();

app.get("/api/fetchUser/:email", (req, res) => {
  console.log(req.params.email);
  fetchUser(req.params.email)
    .then((userObject, reject) => {
      console.log("inside get", userObject);
      if (userObject) {
        res.status(200);
        res.send({
          email: userObject.email,
        });
      } else {
        res.status(404);
        res.send({
          msg: "User not found",
        });
      }
    })
    .catch((error) => console.log(error));
});

app.post("/api/signup", cors(), jsonParser, (req, res) => {
  console.log(req.body.email);
  fetchUser(req.body.email).then((userObject, reject) => {
    if (userObject && userObject.email != req.body.email) {
      var new_user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        _enabled: false,
      });

      new_user.save(function (err) {
        if (err) console.log(err);

        res.status(500);
        res.send({
          msg: "Unknown Error",
        });
      });

      res.status(200);
      res.send({
        msg: "User added successfully",
      });
    } else {
      res.status(403);
      res.send({
        msg: "User already exists",
      });
    }
  });
});

app.post("/api/login", cors(), jsonParser, (req, res) => {
  console.log(req.body.email);
  fetchUser(req.body.email).then((userObject, reject) => {
    console.log(userObject);
    if (userObject && userObject.email == req.body.email) {
      res.status(200);
      res.send({
        msg: "User logged in successfully",
      });
    } else {
      res.status(404);
      res.send({
        msg: "User is not found. Try signing up",
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const fetchUser = async (email) => {
  return await User.findOne({ email: email }, function (error, obj) {
    return obj;
  });
};
