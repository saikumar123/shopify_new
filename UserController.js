var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const UserModel = require("./User");
const itemConfig = require("./config/itemConfig")


router.get("/fetch-account/:accountId", async function (req, res) {
  
    const fetchedUser = await UserModel.fetchUserByAccountId(req.params.accountId);
    if (fetchedUser !== undefined) {
      console.log(fetchedUser);
      res.status(200);
      res.send({
        payload: {
          user: fetchedUser,
        },
        msg: "Successfully retrieved user with accountId - "+req.params.accountId,
      });
      return res;
    } else {
      console.log("No User exist.. with accountId "+req.params.accountId);
      res.status(200).send({
        payload: {
          user: [],
        },
        msg: "No User found with accountId "+req.params.accountId,
      });
    }
  });

module.exports = router;

