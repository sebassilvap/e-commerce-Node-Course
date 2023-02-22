// import dotenv => to have access to local variables in .env file
require('dotenv').config();
// to avoid using try-catch in our controllers
require('express-async-errors');

// getting express
const express = require('express');
const app = express();

// rest of the packages
// morgan => for large projects, it will help us in debugging
const morgan = require('morgan');

// require cookie-parser to access the value of the cookie
const cookieParser = require('cookie-parser');

// package for the upload of images
const fileUpload = require('express-fileupload');

// ==========================
//! SECURITY PACKAGES
// for deployment purposes
// ==========================
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

//! ========================================================================
//! ========================================================================
//! ========================================================================

// database
const connectDB = require('./db/connect');

// =========
// routers
// =========

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');

// ============
// middlewares
// ============

// middlewares for error handling
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// =================================
//! SET UP THE SECURITY PACKAGES
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowsMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
// =================================

// using morgan package
app.use(morgan('tiny'));

// to have access to the json data in our req body
// we use the built in express middleware by the name of json
app.use(express.json());

// use the cookie-parser package
//app.use(cookieParser()); //? now we pass the JWT_SECRET
app.use(cookieParser(process.env.JWT_SECRET));

// make the public folder available - static assets
app.use(express.static('./public'));
app.use(fileUpload());

// ========
// routes
// ========

// home route - get request to home page
app.get('/', (req, res) => {
  res.send('e-commerce api');
});

app.get('/api/v1', (req, res) => {
  //console.log(req.cookies); // with cookie-parser -> now we have access to this! - once we send it the browser makes the rest!

  console.log(req.signedCookies); // once we sign the cookies, we access in this manner

  res.send('e-commerce api');
});

// ====================
// routes middleware
// ====================

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);

// applying middlewares for error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware); // by express rules, we invoke this at last from the successful request, this one we only hit from the existing route

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
