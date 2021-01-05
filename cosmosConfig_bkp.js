const config = {
    endpoint: "https://shopify-cosmos.documents.azure.com:443/",
    key: "Qpve8T0aN9sAICUAwGHqhXVuZrbBnNRCgDeWqGgMevXK5BlMq56PiQhPyaZAm97uNu2DCu3fy3jSIr3fmk3Zmw==",
    databaseId: "shopify",
    containerId: "shopifyFirstContainer",
    partitionKey: { kind: "Hash", paths: ["/userId"] }
  };
  
  module.exports = config;