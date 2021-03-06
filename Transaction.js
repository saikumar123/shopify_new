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
    query: "SELECT * from c WHERE c.avatar=@avatar AND c.category='transaction'",
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
    query: "SELECT * from c WHERE c.avatar=@avatar AND c.category='transaction' ORDER BY c.transactionTimeStamp DESC OFFSET @offset LIMIT @limit",
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
  const transaction = {
    id: req.body.transactionHash,
    description: "Transaction made by the sender",
    category:"transaction",
    receiver:req.body.unlockAddress,
    sender:req.body.lockAddress,
    avatar: avatar,
    accountId: req.body.lockAddress,
    amount: req.body.amount,
    lockId: req.body.lockId,
    transactionTimeStamp: new Date(),
    senderAvatar: req.body.senderAvatar,
    recipientAvatar: req.body.recipientAvatar
  };

  const { resource: createdItem } = await container.items.create(transaction);

  console.log(
    `\r\nCreated new item: ${createdItem.id} - ${createdItem.description}\r\n`
  );
  return createdItem;
};

module.exports = {createTransaction, fetchTransactionById, fetchAccountsByAvatar, fetchAccountsByAvatarLite};