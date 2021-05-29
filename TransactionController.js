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
        creditToAddress: transaction.creditor,
        amount: transaction.amount,
        timestamp: transaction.transactionTimeStamp,
        lockId: transaction.lockId,
        senderAvatar:transaction.senderAvatar,
        recipientAvatar: transaction.recipientAvatar,
        creditorAvatar: transaction.creditorAvatar,
        lockStatus:transaction.lockStatus
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


// fetch transaction by hash id
router.get("/fetch-transactions-by-hash/:txnHash", async function (req, res) {

  const senderTxnId=req.params.txnHash+'sender';
  const transactionSender = await TxnModel.fetchTransactionById(senderTxnId);

  const receiverTxnId=req.params.txnHash+'receiver';
  const transactionReceiver = await TxnModel.fetchTransactionById(receiverTxnId);

  let transactions = [];

  transactions.push({
    transactionHash: transactionSender.id,
    lockAddress: transactionSender.sender,
    unlockAddress: transactionSender.receiver,
    creditToAddress: transaction.creditor,
    amount: transactionSender.amount,
    timestamp: transactionSender.transactionTimeStamp,
    lockId: transactionSender.lockId,
    senderAvatar:transactionSender.senderAvatar,
    recipientAvatar: transactionSender.recipientAvatar,
    creditorAvatar: transaction.creditorAvatar,
    lockStatus:transactionSender.lockStatus
  });

  transactions.push({
    transactionHash: transactionReceiver.id,
    lockAddress: transactionReceiver.sender,
    unlockAddress: transactionReceiver.receiver,
    creditToAddress: transaction.creditor,
    amount: transactionReceiver.amount,
    timestamp: transactionReceiver.transactionTimeStamp,
    lockId: transactionReceiver.lockId,
    senderAvatar:transactionReceiver.senderAvatar,
    recipientAvatar: transactionReceiver.recipientAvatar,
    creditorAvatar: transaction.creditorAvatar,
    lockStatus:transactionReceiver.lockStatus
  });


  if (transactions !== undefined) {
     
    res.status(200);
    res.send({
      payload: {
        transactions: transactions,
      },
      msg:
        "Successfully retrieved transactions with txnHash - " +
        req.params.txnHash,
    });
    return res;
  } else {
    console.log("No Transactions exist for txnHash " + req.params.txnHash);
    res.status(200).send({
      payload: {
        transactions: [],
      },
      msg: "No Transactions found for txnHash " + req.params.txnHash,
    });
  }
});


// update transaction by hash id, sender accountId and receiver accountId
router.get("/update-transactions/sender/:senderId/receiver/:receiverId/hash/:txnHash/lockStatus/:lockStatus", async function (req, res) {

  const senderTxnId=req.params.txnHash+'sender';
  let transactionSender = await TxnModel.fetchTransactionById(senderTxnId);
  if(transactionSender !== 'undefined') {
  transactionSender.lockStatus=req.params.lockStatus;
  transactionSender = await TxnModel.updateTransaction(senderTxnId,req.params.senderId, transactionSender);
}

  const receiverTxnId=req.params.txnHash+'receiver';
  let transactionReceiver = await TxnModel.fetchTransactionById(receiverTxnId);
  if(transactionReceiver !== 'undefined') {
    transactionReceiver.lockStatus = req.params.lockStatus;
    transactionReceiver = await TxnModel.updateTransaction(receiverTxnId,req.params.receiverId,transactionReceiver); 
  }

  if (transactionSender !== undefined && transactionReceiver!== undefined) {
     
    res.status(200);
    res.send({
      payload: {
        transactionsUpdate: true,
      },
      msg:
        "Successfully updated transactions with txnHash - " +
        req.params.txnHash,
    });
    return res;
  } else {
    console.log("No Transactions exist for txnHash " + req.params.txnHash);
    res.status(200).send({
      payload: {
        transactionsUpdate: false,
      },
      msg: "No Transactions found for txnHash and Hence not updated" + req.params.txnHash,
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
        creditToAddress: transaction.creditor,
        amount: transaction.amount,
        timestamp: transaction.transactionTimeStamp,
        lockId: transaction.lockId,
        senderAvatar:transaction.senderAvatar,
        recipientAvatar: transaction.recipientAvatar,
        creditorAvatar: transaction.creditorAvatar,
        lockStatus:transaction.lockStatus
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
            creditToAddress: transaction.creditor,
            amount: transaction.amount,
            timestamp: transaction.transactionTimeStamp,
            lockId: transaction.lockId,
            senderAvatar:transaction.senderAvatar,
            recipientAvatar: transaction.recipientAvatar,
            creditorAvatar: transaction.creditorAvatar,
            lockStatus:transaction.lockStatus
          }] 
        },
      });
    },
    (err) => {
      if (err)
      console.log(err);
        return res
          .status(500)
          .send("There was a problem creating the transaction.");
    }
  );
});

module.exports = router;
