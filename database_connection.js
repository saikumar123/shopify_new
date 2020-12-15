const mongoose = require("mongoose");

 function mongoose_connection() {
    mongoose.connect("mongodb://127.0.0.1:27017/shopify_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
  
}

module.exports= mongoose_connection;
