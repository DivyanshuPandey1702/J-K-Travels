// Import
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const AppError = require('./utils/appError');
const GlobalErrorHandler = require('./controllers/errorControllers');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares

// used to include files in public folder
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// set security http headers
app.use(helmet());

// limit request from same api
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: 'To many requests from this IP , please try again 1 hour later',
});
app.use('/api', limiter);

// morgan console log requests
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// used to take json input from req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// data sanatization against nosql query injection
app.use(mongoSanitize());

// data sanatizaton against xss attacks
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'price',
      'difficulty',
    ],
  })
);

// app.use((req, res, next) => {
//   console.log("Custom Middleware Running..");
//   next();
// });

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTourId);
// app.post("/api/v1/tours", addTour);
// app.patch("/api/v1/tours/:id", updateTourId);
// app.delete("/api/v1/tours/:id", deleteTourId);

app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "connect-src 'self' ws://localhost:*/ http://127.0.0.1:*;"
  );
  next();
});

// Routes -
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`This route ${req.url} does not exists.`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`This route ${req.url} does not exists.`, 404));
});

app.use(GlobalErrorHandler);

module.exports = app;
