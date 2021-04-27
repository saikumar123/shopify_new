var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require("./User");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var config = require("./authConfig");
var randToken = require("rand-token");

var tokenList = {};
router.post("/signup", async function (req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const user = await User.fetchAvatar(req.body.username); 
  if(user !== undefined) {
    console.log(user);
    console.log(user);
    res.status(200);
    res.send({
      payload: {
        user:{
        userName: user.userName,
        avatar: user.avatar,
        email: user.userEmail
        }
      },
      msg: "User already exists. Please login",
    });

    return res;
  } else {
  console.log("User doesnt exist..", user);
  const newUser = await User.createUser(req, hashedPassword)  
  console.log("User created succesfully", newUser);
   if (newUser) {
      var token = jwt.sign({ id: newUser.userId }, config.secret, {
        expiresIn: config.tokenLife,
      });
      const refreshToken = jwt.sign(
        { id: newUser.userId },
        config.refreshTokenSecret,
        {
          expiresIn: config.refreshTokenLife,
        }
      );
      tokenList[refreshToken] = newUser.userId;
      res.cookie("token", token, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      res.cookie("userId", newUser.userId, { httpOnly: true });
      return res.status(201).send({
        auth: true,
        token: "JWT " + token,
        refreshToken: refreshToken,
        payload: { 
          user : {
                userId: newUser.userId,
                userName: newUser.userName,
                avatar: newUser.userName
          }
        },
        msg: "User is successfully added",
      });
    } else {
      
        return res
          .status(500)
          .send("There was a problem registering the user.");
    

    }
  }
});

router.post("/login", function (req, res) {
  User.fetchUser(req).then(
    (user) => {
      if (user) {
        bcrypt.compare(
          req.body.password,
          user.userPassword,
          function (err, validationResult) {
            var token = jwt.sign({ id: user.userId }, config.secret, {
              expiresIn: config.tokenLife,
            });
            const refreshToken = jwt.sign(
              { id: user.userId },
              config.refreshTokenSecret,
              { expiresIn: config.refreshTokenLife }
            );
            tokenList[refreshToken] = user.userId;

            if (validationResult) {
              console.log(token);
              res.cookie("token", token, { httpOnly: true });
              res.cookie("refreshToken", refreshToken, { httpOnly: true });
              res.cookie("userId", user.userId, { httpOnly: true });
              res.status(200).send({
                auth: true,
                token: "JWT " + token,
                refreshToken: refreshToken,
                payload: {
                  userId: user.userId,
                  userName: user.userName,
                  avatar: user.userName
                },
                msg: "Login Successful",
              });
            } else {
              res.status(403).send({
                auth: false,
                token: "",
                payload: {
                  userId: user.userId,
                  userName: user.userName,
                },
                msg: "Password didnot match",
              });
            }
          }
        );
      } else {
        res.status(200);
        res.send({
          payload: {
            name: req.body.email,
          },
          msg: "New user. Please Signup",
        });
      }
    },
    (err) => {
      if (err)
        return res
          .status(500)
          .send("There was a problem registering the user.");
    }
  );
});

router.get("/me", function (req, res) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      console.log("err", err);
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }
    res.status(200).send(decoded);
  });
});

router.post("/token", (req, res) => {
  // refresh the damn token
  const postData = req.body;
  // if refresh token exists
  if (postData.refreshToken && postData.refreshToken in tokenList) {
    const token = jwt.sign({ id: postData.userId }, config.secret, {
      expiresIn: config.tokenLife,
    });
    const response = {
      token: token,
    };
    // update the token in the list
    tokenList[postData.refreshToken].token = token;
    res.status(200).json(response);
  } else {
    res.status(404).send("Invalid request");
  }
});
router.use(require("./tokenChecker"));

router.post("/test", (req, res) => {
  return res.status(200).json({
    status: "success",
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.clearCookie("userId");

  return res.status(200).json({
    status: "success",
  });
});

router.get("/fetch", function (req, res) {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(400);
  }

  if (userId) {
    User.fetchUserByUserId(userId).then(
      (user) => {
        if (user) {
          res.status(200).send({
            // Need to expand this response payload
            payload: {
              userId: user.userId,
              userName: user.userName,
              userEmail: user.userEmail,
            },
            msg: "User Silent Login Successful",
          });
        } else {
          res.status(404);
          res.send({
            payload: {
              name: req.body.email,
            },
            msg: "User not found in the db. This will never happen",
          });
        }
      },
      (err) => {
        if (err) return res.status(500).send("Unknown error occurred.");
      }
    );
  }
});

module.exports = router;
