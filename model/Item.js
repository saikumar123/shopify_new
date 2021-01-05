const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./cosmosConfig");
const dbContext = require("./databaseContext");
const uuid = require("uuid");

const { endpoint, key, databaseId, containerId } = config;

const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);


const createItem = async (req) => {
    const newItem = {
      itemId: uuid.v1(),
      category:"product",
      itemName: req.body.itemName,
      itemDescription: req.body.itemDescription,
      itemUrl: req.body.itemUrl,
      SKU:req.body.SKU,
      Price:req.body.Price
    };
  
    const { resource: createdItem } = await container.items.create(newItem);
  
    console.log(
      `\r\nCreated new product item: ${createdItem.id} - ${createdItem.description}\r\n`
    );
    return createdItem;
  };

  const fetchItemByName = async (req) => {
    console.log(`Querying container with itemName: product Items`);
    const querySpec = {
      query: "SELECT * from c WHERE c.itemName like @itemName AND c.category=`product`",
      parameters: [
        {
          name: "@itemName",
          value: req.body.itemName,
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


  const fetchAllItems = async (req) => {
    console.log(`Querying container: Items`);
    const querySpec = {
      query: "SELECT * from c WHERE c.category=`product`",
    };
    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();
  
    items.forEach((item) => {
      console.log(`${item.id}`);
    });
  
    return items;
  };

  const fetchItemByItemId = async (itemId) => {
    console.log(`Querying container with itemId: product Items`);
    const querySpec = {
      query: "SELECT * from c WHERE c.itemId=@itemId AND c.category=`product`",
      parameters: [
        {
          name: "@itemId",
          value: itemId,
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

  module.exports = {createItem, fetchItemByItemId, fetchItemByName, fetchAllItems};