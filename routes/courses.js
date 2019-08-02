const express = require('express');
const router = express.Router();
const { sequelize, models } = require('../db');
const { User, Course } = models;
const authenticate = require('./authenticate');
const bcryptjs = require('bcryptjs');

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/', (req, res, next) => {
  const user = req.currentUser;
  console.log(user);
  //Find all courses
  Course.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
      }
    ]
  }).then(courses => {
    res.status(200).json({ courses, user });
  }).catch(err => {
    err.status = 400;
    next(err);
  });
});

// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID

router.get('/:id',  (req, res, next) => {
  const courseId = req.params.id;
  Course.findOne({
    attributes:{ exclude: ['createdAt', 'updatedAt'] },
      include: [{
        model:User,
        attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
    }],
    where: [{id: courseId }]
  })
    .then(function(courses){
      res.status(200).json({courses: courses, user: req.currentUser})
    }).catch(function(err){
        err.status = 500;
        next(err);
    });
})

// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content

router.post('/', authenticate, (req, res, next) => {
  if (!req.body.title && !req.body.description) {
    const err = new Error('Please enter a title and a description.');
    err.status = 400;
    next(err);
  } else if (!req.body.title) {
    const err = new Error('Please enter a title.');
    err.status = 400;
    next(err);
  } else if (!req.body.description) {
    const err = new Error('Please enter a description.');
    err.status = 400;
    next(err);
  } else {
    Course.findOne({
			where: {
				title: req.body.title
			}
		}).then(title => {
      if (title) {
				const err = new Error('This course already exists.');
				err.status = 400;
				next(err);
			} else {
				Course.create(req.body).then(course => {
					res.location(`/api/courses/${course.id}`);
					res.status(201).end();
				})
				//Catch errors
				.catch(err => {
					err.status = 400;
					next(err);
				});
			}
		})
	}
});

// PUT /api/courses/:id 204 - Updates a course and returns no content

router.put('/:id', authenticate, (req, res, next) => {
  const user = req.currentUser;
  if (!req.body.title && !req.description) {
    const err = new Error('Please enter a title and a description.');
    err.status = 400;
    next(err);
  } else if (!req.body.title) {
    const err = new Error('Please enter a title.');
    err.status = 400;
    next(err);
  } else if (!req.body.description) {
    const err = new Error('Please enter a description.');
    err.status = 400;
    next(err);
  } else {
    Course.findOne({
      where: {id: req.params.id}
    }).then(course => {
      if(!course) {
        res.status(404).json({ message: 'Course not found.' });
      } else if (course.userId !== user.id) {
        res.status(403).json({ message: 'You are not authorized to change this course.' });
      } else {
        course.update(req.body);
        res.status(204).end();
      }
    }).catch(err => {
				err.status = 400;
				next(err);
			});
    }
});


// DELETE /api/courses/:id 204 - Deletes a course and returns no content

router.delete('/:id', authenticate, (req, res, next) => {
  const user = req.currentUser;
  Course.findOne({
    where: {id: req.params.id}
  }).then(course => {
    if(!course) {
      res.status(404).json({ message: 'Course not found.' });
    } else if (course.userId !== user.id) {
      res.status(403).json({ message: 'You are not authorized to delete this course.' });
    } else {
      course.destroy();
      res.status(204).end();
    }
  }).catch(err => {
      err.status = 400;
      next(err);
  });
});


module.exports = router;
