var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const TxnModel = require("./Transaction");

// fetch all transaction for a avatar
router.get("/fetch-transactions-by-avatar/:avatar", async function (req, res) {

  const fetchedTransactions = await TxnModel.fetchAccountsByAvatar(req.params.avatar);

  if (fetchedTransactions !== undefined) {
    const transactions = fetchedTransactions.map((transaction) => {
      return {
        transactionHash: transaction.id,
        lockAddress: transaction.sender,
        unlockAddress: transaction.receiver,
        amount: transaction.amount,
        timestamp: transaction.transactionTimeStamp,
        lockId: transaction.lockId,
        senderAvatar:transaction.senderAvatar,
        recipientAvatar: transaction.recipientAvatar
      };
    });

    res.status(200);
    res.send({
      payload: {
        transactions: transactions,
      },
      msg:
        "Successfully retrieved transactions with avatar - " +
        req.params.avatar,
    });
    return res;
  } else {
    console.log("No Transactions exist for avatar " + req.params.avatar);
    res.status(200).send({
      payload: {
        transactions: [],
      },
      msg: "No Transactions found for avatar " + req.params.avatar,
    });
  }
});


// fetch all transaction for a avatar-lite-weight
// has offset and limits described
router.get("/fetch-transactions-by-avatar-lite", async function (req, res) {

  let parsedOffest = parseInt(req.query.offset);
  if (isNaN(parsedOffest) || parsedOffest === undefined) { 
    parsedOffest = 0; 
  }

  let parsedLimit = parseInt(req.query.limit);
  if (isNaN(parsedLimit) || parsedLimit === undefined) { 
    parsedLimit = 5; 
  }

  const fetchedTransactionsLite = await TxnModel.fetchAccountsByAvatarLite(
    req.query.avatar, parsedOffest, parsedLimit
  );

  if (fetchedTransactionsLite !== undefined) {
    const transactions = fetchedTransactionsLite.map((transaction) => {
      return {
        transactionHash: transaction.id,
        lockAddress: transaction.sender,
        unlockAddress: transaction.receiver,
        amount: transaction.amount,
        timestamp: transaction.transactionTimeStamp,
        lockId: transaction.lockId,
        senderAvatar:transaction.senderAvatar,
        recipientAvatar: transaction.recipientAvatar
      };
    });

    res.status(200);
    res.send({
      payload: {
        transactions: transactions,
      },
      msg:
        "Successfully retrieved transactions with avatar - " +
        req.query.avatar,
    });
    return res;
  } else {
    console.log("No Transactions exist for avatar " + req.query.avatar);
    res.status(200).send({
      payload: {
        transactions: [],
      },
      msg: "No Transactions found for avatar " + req.query.avatar,
    });
  }
});

router.post("/create-transaction/:avatar", function (req, res) {
  TxnModel.createTransaction(req, req.params.avatar).then(
    (transaction) => {
      return res.status(200).send({
        payload: {
          transactions : [{
            transactionHash: transaction.id,
            lockAddress: transaction.sender,
            unlockAddress: transaction.receiver,
            amount: transaction.amount,
            timestamp: transaction.transactionTimeStamp,
            lockId: transaction.lockId,
            senderAvatar:transaction.senderAvatar,
            recipientAvatar: transaction.recipientAvatar
          }] 
        },
      });
    },
    (err) => {
      if (err)
        return res
          .status(500)
          .send("There was a problem creating the transaction.");
    }
  );
});

module.exports = router;
