'use strict'
const Sequelize = require('sequelize');
const db = require('../config/database');

const Courses = db.define('courses', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: ,
  title: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: {
        msg: "Title is required"
      }
    }
  },
  description: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: {
        msg: "Description is required"
      }
    }
  },
  estimatedTime: {
    type: Sequelize.STRING,
    allowNull: true
  },
  materialsNeeded: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
})

module.exports = Courses;
