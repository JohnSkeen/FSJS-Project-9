'use strict';

const express = require('express');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { sequelize, models } = require('../db');
const { User, Course } = models;

// Construct a router instance.
const router = express.Router();

module.exports = (req, res, next) => {
  let message = null;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  // If the user's credentials are available...
  if (credentials) {
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).
    User.findOne({where: {emailAddress: credentials.name}})
      .then(user => {
        // If a user was successfully retrieved from the data store...
        if (user) {
          // Use the bcryptjs npm package to compare the user's password
          // (from the Authorization header) to the user's password
          // that was retrieved from the data store.
          const authenticated = bcryptjs
            .compareSync(credentials.pass, user.password);

          // If the passwords match...
          if (authenticated) {
            console.log(`Authentication successful for username: ${user.emailAddress}`);

            // Then store the retrieved user object on the request object
            // so any middleware functions that follow this middleware function
            // will have access to the user's information.
            req.currentUser = user;
            next();
          } else {
            message = `Authentication failure for username: ${user.emailAddress}`;
            res.status(401);
            res.json({message: message});
          }
        }
      });
  } else {
    const err = new Error('Please enter a valid email address and password');
    err.status = 401;
    next(err);
  }
};
