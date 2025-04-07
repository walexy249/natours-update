const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// mongoose
//   .connect(DB)
//   .then((connection) => {
//     console.log('Database connection successful');
//   })
//   .catch((err) => console.error('MongoDB connection error:', err));

// Enhanced MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Reduce from default 30s to fail faster
  socketTimeoutMS: 45000, // Close idle connections after 45s
  maxPoolSize: 10, // Maximum number of sockets in pool
  retryWrites: true, // Enable retryable writes
  retryReads: true, // Enable retryable reads
  connectTimeoutMS: 10000, // Give up initial connection after 10s
};

// Connection with retry logic
const connectWithRetry = () => {
  mongoose
    .connect(DB, mongooseOptions)
    .then(() => console.log('✅ Database connection successful'))
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.log('⏳ Retrying connection in .5 seconds...');
      setTimeout(connectWithRetry, 500);
    });
};

// Initial connection attempt
connectWithRetry();

const server = app.listen(process.env.PORT, () => {
  console.log('app is running on port ', process.env.PORT);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log('Error', error);
  console.log(err.name, err.message);
  server.close(() => {
    console.log('Unhandled Rejections. Shutting down......');
    process.exit(1);
  });
});
