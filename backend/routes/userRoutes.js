const { body, check } = require('express-validator');
const User = require('../models/User');
const express = require('express');
const router = express.Router();

const { getUsers, postUser } = require('../controllers/userController');

router.route('/').post(
  [
    check('id')
      .not()
      .isEmpty()
      .withMessage('id is required')
      .matches(/^[0-9]+$/)
      .withMessage('id must be a postive Integer')
      .custom((value, { req }) => {
        return User.findOne({ userId: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(`User with UserId : ${value} already exists`);
          }
        });
      }),
    body('name').not().isEmpty().trim().withMessage('Name is required'),
  ],
  getUsers
);

module.exports = router;
