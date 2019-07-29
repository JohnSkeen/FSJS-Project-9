'use strict'
const Sequelize = require('sequelize');
const db = require('../config/database');

const Users = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: "First name is required"
      }
    }
  },
  lastName: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: "Last name is required"
      }
    }
  },
  emailAddress: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: "Email is required"
      }
    }
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: "Password is required"
      }
    }
  },
})

module.exports = Users;
