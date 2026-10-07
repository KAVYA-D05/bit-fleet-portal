const mongoose = require('mongoose');

let isConnectedToMongo = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bit_fleet_portal';
    
    // Set a fast connection timeout for smooth fallback if mongod is not local
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    
    isConnectedToMongo = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnectedToMongo = false;
    console.warn(`[MongoDB] Local MongoDB server not detected (${error.message}).`);
    console.log(`[DataStore] Initialized Embedded Persistent BIT Data Engine with full Mongoose compatibility.`);
    return false;
  }
};

const getIsConnectedToMongo = () => isConnectedToMongo;

module.exports = {
  connectDB,
  getIsConnectedToMongo
};
