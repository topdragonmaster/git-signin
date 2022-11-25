const mongoose = require("mongoose");
require("dotenv").config();
async function dbConnect() {
  mongoose
    .connect(process.env.DB_URL, { dbName: "test" })
    .then(() => {
      console.log("Successfully connected to MongoDB!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB!");
      console.error(JSON.stringify(error));
    });
}

module.exports = dbConnect;
