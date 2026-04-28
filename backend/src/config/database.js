const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit process on Render - allow app to start for health checks
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    return null;
  }
};

module.exports = connectDB;
