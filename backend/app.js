const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const { ValidationError } = require('sequelize');
const isProduction = environment === 'production';

const routes = require('./routes');

const app = express();

app.use(routes);

app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
  app.use(cors());
}

app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);
app.use(routes);

// ERROR HANDLING MIDDLEWARE
// "Resource not found" Error-Handler
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});

// Sequelize Error-Handler
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = 'Validation error';
  }
  next(err);
});

// Error Formatting Error-Hanlder
// SHOULD BE FINAL ERROR HANDLER IN app.js
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

module.exports = app;
