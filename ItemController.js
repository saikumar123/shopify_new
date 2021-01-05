var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const ItemModel = require("./model/Item");

router.get("/fetch-all-items", async function (req, res) {
  const fetchedItems = await ItemModel.fetchAllItems(req);
  if (fetchedItems !== undefined) {
    console.log(fetchedItems);
    res.status(200);
    res.send({
      payload: {
        items: fetchedItems,
      },
      msg: "Retrieve Items Successful",
    });
    return res;
  } else {
    console.log("No Items exist..", fetchedItems);
    res.status(200).send({
      payload: {
        items: [],
      },
      msg: "No Items found",
    });
  }
});

router.get("/fetch-item:itemId", async function (req, res) {
    const fetchedItems = await ItemModel.fetchItemByItemId(req);
    if (fetchedItems !== undefined) {
      console.log(fetchedItems);
      res.status(200);
      res.send({
        payload: {
          items: fetchedItems,
        },
        msg: "Retrieve Items Successful",
      });
      return res;
    } else {
      console.log("No Items exist..", fetchedItems);
      res.status(200).send({
        payload: {
          items: [],
        },
        msg: "No Items found",
      });
    }
  });
