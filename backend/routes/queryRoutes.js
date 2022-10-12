const { check } = require('express-validator');
const User = require('../models/User');
const express = require('express');
const router = express.Router();

const { getTradesSummary } = require('../controllers/queryController');

router.route('/').post(
  [
    check('userId')
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ id: value });

        if (!userDoc) {
          return Promise.reject(`User with UserId : ${value} doesn't exist`);
        }
      })
      .optional(),
    check('executionType')
      .isIn(['buy', 'sell'])
      .withMessage('Execution Type must be either buy or sell (case sensitive)')
      .optional(),
    check('executionStartDate')
      .isISO8601()
      .toDate()
      .withMessage('ExecutionStartDate must be of format: YYYY-MM-DD HH:MM:SS')
      .optional(),
    check('executionEndDate')
      .isISO8601()
      .toDate()
      .withMessage('ExecutionEndDate must be of format: YYYY-MM-DD HH:MM:SS')
      .optional(),
  ],
  getTradesSummary
);

module.exports = router;
