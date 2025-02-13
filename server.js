const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
// console.log(process.env);
const port = 3000;

app.listen(port, () => {
  console.log('app is running on port ', port);
});

// const x = 766;
// x = 7;
