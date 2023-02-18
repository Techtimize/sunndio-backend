const dotenv = require("dotenv");
dotenv.config();

// exporting the environment variables  
module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
};