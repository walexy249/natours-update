const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');
dotenv.config({ path: './config.env' });
// console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((connection) => {
  console.log('Database connection successful');
});

app.listen(process.env.PORT, () => {
  console.log('app is running on port ', process.env.PORT);
});
