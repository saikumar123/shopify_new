const config = {
    endpoint: "https://shopify-cosmos.documents.azure.com:443/",
    cosmosDBUrl: process.env.COSMOSDB_URL,
    key: "Qpve8T0aN9sAICUAwGHqhXVuZrbBnNRCgDeWqGgMevXK5BlMq56PiQhPyaZAm97uNu2DCu3fy3jSIr3fmk3Zmw==",
    databaseId: "shopify",
    containerId: "shopifyOverallContainer",
    partitionKey: { kind: "Hash", paths: ["/category"] }
  };
  
  module.exports = config;