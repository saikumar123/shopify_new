const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./cosmosConfig");
const dbContext = require("./databaseContext");
const uuid = require("uuid");

const { endpoint,cosmooksDBUrl, key, databaseId, containerId } = config;

const  cosmosDBUrlFromConfig = `${process.env.COSMOSDB_URL}`;
/*
console.log(cosmosDBUrl);
if (cosmosDBUrl !== undefined && cosmosDBUrl !== 'undefined') {  
  console.log('a')
  cosmosDBUrlFromConfig = cosmosDBUrl ;
} */
console.log(cosmosDBUrlFromConfig);

const client = new CosmosClient({endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);

const createUser = async (req , hashedPassword) => {
  const newUser = {
    userId: uuid.v1(),
    category:"user",
    userName: req.body.username,
    avatar:req.body.username,
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
    query: "SELECT * from c WHERE c.userEmail=@email and c.category='user'",
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
    query: "SELECT * from c WHERE c.userId=@userId and c.category='user'",
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
    query: "SELECT * from c WHERE c.accountId=@accountId and c.category='user'",
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

const updateUserByAccountId = async (id, user) => {
   const { resource: updatedUser } = await container
      .item(id,'user')
      .replace(user);    
    console.log(`Updated item: ${updatedUser.timeStamp} - ${updatedUser.id}`);        
    return updatedUser;
};

const fetchUserByAccountEmail = async (email) => {
  console.log(`Querying container: Items`);
  const querySpec = {
    query: "SELECT * from c WHERE STARTSWITH(c.userEmail, @email) OR STARTSWITH(c.avatar, @email) and c.category='user'",
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

const fetchUserByUsername = async (username) => {
  console.log(`Querying container: Items`);
  console.log("username =",username)
  const querySpec = {
    query: "SELECT * from c WHERE c.userName=@username and c.category='user'",
    parameters: [
      {
        name: "@username",
        value: username,
      }
    ],
  };

  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  return items[0];
};

const fetchAvatar = async (avatar) => {
  console.log(`Querying container: Items`);
  console.log("avatar =",avatar)
  const querySpec = {
    query: "SELECT * from c WHERE c.avatar=@avatar and c.category='user'",
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

  return items[0];
};

module.exports = {createUser, fetchUser, fetchUserByUserId,fetchUserByAccountId,updateUserByAccountId, fetchUserByAccountEmail, fetchUserByUsername, fetchAvatar};