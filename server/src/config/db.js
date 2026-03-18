
// src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // The connection string should be in your .env file as MONGO_URI
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1); 
  }

};

module.exports = connectDB;