'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

// load database
const { sequelize, models } = require('./db');

// get references to our models
const { User, Course } = models;

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Test DB
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected');
    return sequelize.sync();
  })
  .catch(err => console.log('Error: ' + err))

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// give express the ability to read the body
app.use(express.json());

// TODO setup your api routes here

app.use('/api', require('./routes/index'));
app.use('/api/users', require ('./routes/users'));
app.use('/api/courses', require ('./routes/courses'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to my REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
