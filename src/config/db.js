const mongoose = require("mongoose");
const config = require("../config/config");
mongoose.set("strictQuery", true);

// creating connection with MongoDB
mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    console.log("Database Connection is done...");
  })
  .catch((err) => {
    console.log(err);
  });
