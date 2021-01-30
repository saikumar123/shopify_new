const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./cosmosConfig");
const dbContext = require("./databaseContext");
const uuid = require("uuid");

const { endpoint,cosmosDBUrl, key, databaseId, containerId } = config;

const client = new CosmosClient({ cosmosDBUrl, key });

const database = client.database(databaseId);
const container = database.container(containerId);

const createUser = async (req , hashedPassword) => {
  const newUser = {
    userId: uuid.v1(),
    category:"user",
    userName: req.body.name,
    userEmail: req.body.email,
    userPassword: hashedPassword,
    accountId: req.body.accountId,
    userRole:req.body.role
  };

  const { resource: createdItem } = await container.items.create(newUser);

  console.log(
    `\r\nCreated new item: ${createdItem.id} - ${createdItem.description}\r\n`
  );
  return createdItem;
};

const fetchUser = async (req) => {
  console.log(`Querying container: Items`);
  const querySpec = {
    query: "SELECT * from c WHERE c.userEmail=@email",
    parameters: [
      {
        name: "@email",
        value: req.body.email,
      }
    ],
  };
  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  items.forEach((item) => {
    console.log(`${item.id}`);
  });

  return items[0];
};

const fetchUserByUserId = async (userId) => {
  console.log(`Querying container: Items`);
  const querySpec = {
    query: "SELECT * from c WHERE c.userId=@userId",
    parameters: [
      {
        name: "@userId",
        value: userId,
      }
    ],
  };
  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  items.forEach((item) => {
    console.log(`${item.id}`);
  });

  return items[0];
};

const fetchUserByAccountId = async (accountId) => {
  console.log(`Querying container: Items`);
  const querySpec = {
    query: "SELECT * from c WHERE c.accountId=@accountId",
    parameters: [
      {
        name: "@accountId",
        value: accountId,
      }
    ],
  };
  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  items.forEach((item) => {
    console.log(`${item.id}`);
  });

  return items[0];
};

const fetchUserByAccountEmail = async (email) => {
  console.log(`Querying container: Items`);
  const querySpec = {
    query: "SELECT * from c WHERE STARTSWITH(c.userEmail, @email) OR STARTSWITH(c.avatar, @email)",
    parameters: [
      {
        name: "@email",
        value: email,
      }
    ],
  };
  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  items.forEach((item) => {
    console.log(`${item.id}`);
  });

  return items;
};

const fetchUserByAccountAvatar = async (avatar) => {
  console.log(`Querying container: Items`);
  const querySpec = {
    query: "SELECT * from c WHERE c.avatar=@avatar",
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

  items.forEach((item) => {
    console.log(`${item.id}`);
  });

  return items[0];
};

module.exports = {createUser, fetchUser, fetchUserByUserId,fetchUserByAccountId, fetchUserByAccountEmail, fetchUserByAccountAvatar};