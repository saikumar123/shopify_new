// const CosmosClient = require("@azure/cosmos").CosmosClient;
// const config = require("./cosmosConfig");
// const dbContext = require("./databaseContext");
// const uuid = require("uuid");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// var jsonParser = bodyParser.json();
/*
var allowlist = ['http://localhost:3000']
var corsOptions = {
  origin: 'http://localhost:3000',credentials:true
} */

//app.use('*', [cors(corsOptions), cookieParser()]);
//app.use(cors());

var allowedList = ['http://sample.testmycoding.com','http://localhost:3000', 'http://localhost:3001']
var corsOptions = {
  origin: allowedList
}
app.use('*', cors(corsOptions));

var AuthController = require('./AuthController');
var UserController = require('./UserController');
var ItemController = require('./ItemController');
var TransactionController = require('./TransactionController');
app.use('/api/auth', AuthController);
app.use('/api/user', UserController);
app.use('/api/txn', TransactionController);
app.use('/api/item', ItemController);
const port = process.env.PORT || 8080;



// const { endpoint, key, databaseId, containerId } = config;

// const client = new CosmosClient({ endpoint, key });

// const database = client.database(databaseId);
// const container = database.container(containerId);

// // const products = async(req) => {
// // const product = {
// //   productId: uuid.v1(),
// //   productName: 
// // }

// // }


// const createUser = async (req) => {
//   const newUser = {
//     userId: uuid.v1(),
//     userName: req.body.name,
//     userEmail: req.body.email,
//     userPassword: req.body.password,
//     userRole:req.body.role
//   };
  

//   const { resource: createdItem } = await container.items.create(newUser);

//   console.log(
//     `\r\nCreated new item: ${createdItem.id} - ${createdItem.description}\r\n`
//   );
// };

// app.post("/api/signup", cors(), jsonParser, (req, res) => {
//   console.log(req.body.email);
//   const requestedUser = fetchUser(req);
//   requestedUser.then((userObject) => {
//     console.log("Fetched from db", userObject);
//     if (!userObject) {
//       createUser(req);
//       res.status(201);
//       res.send({
//         payload:{
//           name:req.body.email
//         },
//         msg: "User is successfully added",
//       });
//     } else{
//       res.status(200);
//       res.send({
//         payload:{
//           name:userObject.userName
//         },
//         msg: "User already exists. Please login",
//       });
//     }
//   });
// });

// app.post("/api/login", cors(), jsonParser, (req, res) => {
//   console.log(req.body.email);
//   const requestedUser = fetchUser(req);
//   requestedUser.then((userObject) => {
//     console.log("Fetched from db", userObject);
//     if (!userObject) {
    
//       res.status(200);
//       res.send({
//         payload:{
//           name:req.body.email
//         },
//         msg: "New user. Please Signup",
//       });
//     } else{
//       res.status(200);
//       res.send({
//         payload:{
//           name:userObject.userEmail,
//           userId:userObject.userId
//         },
//         msg: "Login Successful",
//       });
//     }
//   });
// });

// const fetchUser = async (req) => {
//   console.log(`Querying container: Items`);
//   const querySpec = {
//     query: "SELECT * from c WHERE c.userEmail=@email",
//     parameters: [
//       {
//         name: "@email",
//         value: req.body.email,
//       },
//     ],
//   };
//   const { resources: items } = await container.items
//     .query(querySpec)
//     .fetchAll();

//   items.forEach((item) => {
//     console.log(`${item.id}`);
//   });

//   return items[0];
// };

app.listen(port || 8080, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
