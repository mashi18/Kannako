const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Atlas connection error: ${error.message}`);
    console.error('Make sure your Atlas credentials in backend/.env are correct');
    console.error('Also ensure your IP is whitelisted in Atlas Network Access');
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

module.exports = connectDB;
