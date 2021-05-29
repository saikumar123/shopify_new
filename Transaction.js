const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./cosmosConfig");

const { endpoint, key, databaseId, containerId } = config;

const client = new CosmosClient({endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);

const fetchTransactionById = async (id) => {
  console.log(`Querying container: Items`);
  const querySpec = {
    query: "SELECT * from c WHERE c.id=@id",
    parameters: [
      {
        name: "@id",
        value: id,
      }
    ],
  };
  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();
  return items[0];
};

const fetchAccountsByAvatar = async (avatar) => {
  console.log(`Querying container: Items`);
  const querySpec = {
    query: "SELECT * from c WHERE c.avatar=@avatar AND c.type='TRANSACTION'",
    parameters: [
      {
        name: "@avatar",
        value: avatar,
      }
    ],
  };
  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  return items;
};

const fetchAccountsByAvatarLite = async (avatar, offset, limit) => {
  const querySpec = {
    query: "SELECT * from c WHERE c.avatar=@avatar AND c.type='TRANSACTION' ORDER BY c.transactionTimeStamp DESC OFFSET @offset LIMIT @limit",
    parameters: [
      {
        name: "@avatar",
        value: avatar,
      },
      {
        name: "@limit",
        value: limit,
      },
      {
        name: "@offset",
        value: offset,
      }
    ],
  };
  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  return items;
};


const createTransaction = async (req,avatar) => {

  const timeStamp = new Date();
  const senderId = req.body.transactionHash + 'sender';
  const receiverId =req.body.transactionHash + 'receiver';

  const senderTransaction = {
    id: senderId,
    description: "Transaction made by the sender",
    type:'TRANSACTION',
    category:req.body.lockAddress,
    receiver:req.body.unlockAddress,
    sender:req.body.lockAddress,
    creditor: req.body.creditToAddress,
    avatar: avatar,
    accountId: req.body.lockAddress,
    amount: req.body.amount,
    lockId: req.body.lockId,
    transactionTimeStamp: timeStamp,
    senderAvatar: req.body.senderAvatar,
    recipientAvatar: req.body.recipientAvatar,
    creditorAvatar: req.body.creditorAvatar,
    lockStatus: "LOCKED"
  };

  const recieverTransaction = {
    id: receiverId,
    description: "Transaction received by the receiver",
    type:'TRANSACTION',
    category:req.body.unlockAddress,
    receiver:req.body.unlockAddress,
    sender:req.body.lockAddress,
    creditor: req.body.creditToAddress,
    avatar: req.body.recipientAvatar,
    accountId: req.body.unlockAddress,
    amount: req.body.amount,
    lockId: req.body.lockId,
    transactionTimeStamp: timeStamp,
    senderAvatar: req.body.senderAvatar,
    recipientAvatar: req.body.recipientAvatar,
    creditorAvatar: req.body.creditorAvatar,
    lockStatus: "UNLOCK"
  };

  const { resource: createdItemSender } = await container.items.create(senderTransaction);

  console.log(
    `\r\nCreated new item: ${createdItemSender.id} - ${createdItemSender.description}\r\n`
  );

  const { resource: createdItemReceiver } = await container.items.create(recieverTransaction);


  console.log(
    `\r\nCreated new item: ${createdItemReceiver.id} - ${createdItemReceiver.description}\r\n`
  );


  if(req.body.creditToAddress) {
    const creditId =req.body.transactionHash + 'creditor';

  const creditTransaction = {
    id: creditId,
    description: "Transaction for by the creditor",
    type:'TRANSACTION',
    category:req.body.creditToAddress,
    receiver:req.body.unlockAddress,
    sender:req.body.lockAddress,
    creditor: req.body.creditToAddress,
    avatar: avatar,
    accountId: req.body.lockAddress,
    amount: req.body.amount,
    lockId: req.body.lockId,
    transactionTimeStamp: timeStamp,
    senderAvatar: req.body.senderAvatar,
    recipientAvatar: req.body.recipientAvatar,
    creditorAvatar: req.body.creditorAvatar,
    lockStatus: "CREDITED"
  };

  const { resource: createdItemCreditedTo } = await container.items.create(creditTransaction);


  console.log(
    `\r\nCreated new item: ${createdItemCreditedTo.id} - ${createdItemCreditedTo.description}\r\n`
  );
  }

  return createdItemSender;
};


const updateTransaction = async(txnHash,accountId,transaction) => {

const { resource: updatedTransaction } = await container
  .item(txnHash, accountId)
  .replace(transaction);

console.log(`Updated item: ${updatedTransaction.id} - ${updatedTransaction.description}`); 
console.log(`Updated lockStatus to ${updatedTransaction.lockStatus}\r\n`);

return updatedTransaction;

}

module.exports = {createTransaction, fetchTransactionById, fetchAccountsByAvatar, fetchAccountsByAvatarLite, updateTransaction};