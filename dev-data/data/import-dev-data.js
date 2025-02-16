const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

mongoose.connect(DB).then((connection) => {
  console.log('Database connection successful');
});

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully  deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
console.log(process.argv);

if (process.argv[2] === '--import') {
  console.log('hey');
  importData();
} else if (process.argv[2] === '--delete') {
  console.log('hey');

  deleteData();
} else {
  console.log('nah', process.argv[2]);
}
