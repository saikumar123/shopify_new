const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./cosmosConfig");
const dbContext = require("./databaseContext");
const uuid = require("uuid");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

const port = 8080;
app.use(cors());

const { endpoint, key, databaseId, containerId } = config;

const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);

const createUser = async (req) => {
  const newUser = {
    userId: uuid.v1(),
    userName: req.body.name,
    userEmail: req.body.email,
    userPassword: req.body.password,
    userRole:req.body.role
  };

  const { resource: createdItem } = await container.items.create(newUser);

  console.log(
    `\r\nCreated new item: ${createdItem.id} - ${createdItem.description}\r\n`
  );
};

app.post("/api/signup", cors(), jsonParser, (req, res) => {
  console.log(req.body.email);
  const requestedUser = fetchUser(req);
  requestedUser.then((userObject) => {
    console.log("Fetched from db", userObject);
    if (!userObject) {
      createUser(req);
      res.status(201);
      res.send({
        payload:{
          name:userObject.userName
        },
        msg: "User is successfully added",
      });
    } else{
      res.status(200);
      res.send({
        payload:{
          name:userObject.userName
        },
        msg: "User already exists. Please login",
      });
    }
  });
});

const fetchUser = async (req) => {
  console.log(`Querying container: Items`);

  // query to return all items
  const querySpec = {
    query: "SELECT * from c WHERE c.userEmail=@email",
    parameters: [
      {
        name: "@email",
        value: req.body.email,
      },
    ],
  };

  // read all items in the Items container
  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  items.forEach((item) => {
    console.log(`${item.id}`);
  });

  return items[0];
};

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
