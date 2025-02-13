const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');
// console.log(process.env);
const port = 3000;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((connection) => {
  console.log('Database connection successful');
});

app.listen(port, () => {
  console.log('app is running on port ', port);
});
