const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    tours,
  });
};

exports.getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.updateTour = (req, res) => {
  const id = +req.params.id;
  const index = tours.findIndex((el) => el.id === id);
  if (index === -1) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }
  tours[index].name = req.body.name;

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: tours[index],
        },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  const id = +req.params.id;
  const index = tours.findIndex((el) => el.id === id);
  if (index === -1) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  tours.splice(index, 1);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(204).json({
        status: 'success',
        data: {
          message: 'item deleted successfully',
        },
      });
    }
  );
};

exports.createTour = (req, res) => {
  const id = tours[tours.length - 1].id + 1;
  const newTours = Object.assign({ id }, req.body);
  tours.push(newTours);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        results: tours.length,
        tours,
      });
    }
  );
};
