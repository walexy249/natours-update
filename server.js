const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');
// console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then((connection) => {
    console.log('Database connection successful');
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(process.env.PORT, () => {
  console.log('app is running on port ', process.env.PORT);
});
