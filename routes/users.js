const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const { sequelize, models } = require('../db');
const { User, Course } = models;
const authenticate = require('./authenticate');
const bcryptjs = require('bcryptjs');

/* GET current user (Read users that already exist) */
router.get('/', authenticate, (req, res) => {
  //OK - working
  res.status(200);
  //Bring back formatted JSON data
  res.json({
      id: req.currentUser.id,
      firstName: req.currentUser.firstName,
      lastName: req.currentUser.lastName,
      emailAddress: req.currentUser.emailAddress,
  });
  res.end();
});

router.post('/', (req, res) => {
  if (!req.body.emailAddress && !req.body.password) {
    const err = new Error('Please enter a valid email and password');
    err.status = 400;
    next(err);
  } else if (!req.body.emailAddress) {
    const err = new Error('Please enter a valid email address');
    err.status = 400;
    next(err);
  } else if (!req.body.password) {
    const err = new Error('Please enter a valid email address');
    err.status = 400;
    next(err);
  } else {
    const newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailAddress: req.body.emailAddress,
      password: req.body.password
    };

    newUser.password = bcryptjs.hashSync(newUser.password);
    User.create(newUser)
      .then(() => {
        res.location('/');
        res.status(201).end();
      }).catch((err) => {
        if(err.name === "SequelizeValidationError" || err.name === "SequelizeConstraintError" ) {
          res.status(400).json({
            err: err.errors
          })
        } else {
          err.status(500);
          next(err);
        }
      })
  };
});


module.exports = router;
