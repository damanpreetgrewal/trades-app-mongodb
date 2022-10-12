const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const formatDate = require('../utils/formatDate');

// @desc Get all Users
// @route GET /api/users
// @access Public
const getUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(200).json({ message: 'No Users found.' });
    }
    const transformedUsers = users.map(user => {
      return {
        id: user.id,
        name: user.name,
      };
    });
    res.status(200).json(transformedUsers);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

// @desc Post a User
// @route POST /api/users
// @access Public
const postUser = asyncHandler(async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.validationErrors = errors.errors;
      error.statusCode = 422;
      throw error;
    }
    const countOfUsersBefore = await User.find().count();

    const user = await User.create({
      id: countOfUsersBefore + 1,
      name: req.body.name,
    });

    res.status(201).json({
      message: 'User posted successfully.',
      user: {
        id: user.id,
        name: user.name,
        recordCreatedAt: formatDate(user.createdAt),
        recordUpdatedAt: formatDate(user.updatedAt),
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = { getUsers, postUser };
