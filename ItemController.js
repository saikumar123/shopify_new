var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const ItemModel = require("./model/Item");
const itemConfig = require("./config/itemConfig")

router.get("/fetch-all-items", async function (req, res) {
  const fetchedItems = await ItemModel.fetchAllItems(req);
  if (fetchedItems !== undefined) {
    console.log(fetchedItems);
    res.status(200);
    
var items = [];
    fetchedItems.forEach((selectedItem) => {
        var item = {
            itemId: selectedItem.itemId,
            itemName:selectedItem.itemName,
            itemUrl:itemConfig.itemBaseUrl+selectedItem.itemUrl,
            itemDescription:selectedItem.itemDescription,
            itemPrice: selectedItem.Price.amount+" "+selectedItem.Price.currency
        }
        items.push(item);
      });

    res.send({
      payload: {
        items: items,
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
    const fetchedItem = await ItemModel.fetchItemByItemId(itemId);
    if (fetchedItem !== undefined) {
      console.log(fetchedItem);
      res.status(200);
      res.send({
        payload: {
          item: fetchedItem,
        },
        msg: "Successfully retrieved item with itemId - "+itemId,
      });
      return res;
    } else {
      console.log("No Item exist.. with itemId "+itemId);
      res.status(200).send({
        payload: {
          item: [],
        },
        msg: "No Item found with itemId "+itemId,
      });
    }
  });

  router.get("/fetch-item:itemName", async function (req, res) {
    const fetchedItem = await ItemModel.fetchItemByName(itemName);
    if (fetchedItem !== undefined) {
      console.log(fetchedItem);
      res.status(200);
      res.send({
        payload: {
          item: fetchedItem,
        },
        msg: "Successfully retrieved item with itemName - "+itemName,
      });
      return res;
    } else {
      console.log("No Item exists with itemName "+itemName);
      res.status(200).send({
        payload: {
          item: [],
        },
        msg: "No Item found with itemName - "+itemName,
      });
    }
  });


//   router.post("/create-item", async function (req, res) {
//     const fetchedItem = await ItemModel.fetchItemByName(itemName);
//     if (fetchedItem !== undefined) {
//       console.log(fetchedItem);
//       res.status(200);
//       res.send({
//         payload: {
//           item: fetchedItem,
//         },
//         msg: "Successfully retrieved item with itemName - "+itemName,
//       });
//       return res;
//     } else {
//       console.log("No Item exists with itemName "+itemName);
//       res.status(200).send({
//         payload: {
//           item: [],
//         },
//         msg: "No Item found with itemName - "+itemName,
//       });
//     }
//   });


module.exports = router;

