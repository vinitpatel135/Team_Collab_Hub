const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connection established");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

module.exports = dbConnection;
