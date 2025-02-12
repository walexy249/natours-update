const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'hello world', app: 'natours' });
// });

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Middleware');
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    tours,
  });
};

const getTour = (req, res) => {
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

const updateTour = (req, res) => {
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

const deleteTour = (req, res) => {
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

const createTour = (req, res) => {
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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'This route is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'This route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'This route is not yet defined',
  });
};

const updateUSer = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'This route is not yet defined',
  });
};
// app.get('/api/v1/tours', getAllTour);

// app.get('/api/v1/tours/:id', getTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

// app.post('/api/v1/tours', createTour);

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTour).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUSer).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

const port = 3000;

app.listen(port, () => {
  console.log('app is running on port ', port);
});
