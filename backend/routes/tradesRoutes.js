const { body, check } = require('express-validator');
const User = require('../models/User');
const express = require('express');
const router = express.Router();

const {
  getTrades,
  getSingleTrade,
  postTrade,
  updateTrade,
  deleteTrade,
} = require('../controllers/tradesController');

router
  .route('/')
  .get(getTrades)
  .post(
    [
      body('ticker')
        .not()
        .isEmpty()
        .trim()
        .withMessage('ticker symbol is required')
        .matches(/^[A-Z]+$/)
        .withMessage('ticker symbol must contain all uppercase letters'),
      body('amount')
        .not()
        .isEmpty()
        .withMessage('Amount is required')
        .matches(/^[0-9.]+$/)
        .withMessage('Amount must be a postive Integer'),
      body('price')
        .not()
        .isEmpty()
        .withMessage('Price is required')
        .matches(/^[0-9.]+$/)
        .withMessage('Price must be a postive Integer'),
      check('executionType')
        .isIn(['buy', 'sell'])
        .withMessage(
          'Execution Type must be either buy or sell (case sensitive)'
        ),
      check('userId').custom(async (value, { req }) => {
        return User.findOne({ id: value }).then(userDoc => {
          if (!userDoc) {
            return Promise.reject(`User with id : ${value} doesnt exist`);
          }
        });
      }),
      check('executionDate')
        .isISO8601()
        .toDate()
        .withMessage('Execution Date must be of format: YYYY-MM-DD HH:MM:SS'),
    ],
    postTrade
  );

router
  .route('/:id')
  .get(getSingleTrade)
  .put(
    [
      body('ticker')
        .not()
        .isEmpty()
        .trim()
        .withMessage('ticker symbol is required')
        .matches(/^[A-Z]+$/)
        .withMessage('ticker symbol must contain all uppercase letters'),
      body('amount')
        .not()
        .isEmpty()
        .withMessage('Amount is required')
        .matches(/^[0-9.]+$/)
        .withMessage('Amount must be a postive Integer'),
      body('price')
        .not()
        .isEmpty()
        .withMessage('Price is required')
        .matches(/^[0-9.]+$/)
        .withMessage('Price must be a postive Integer'),
      check('executionType')
        .isIn(['buy', 'sell'])
        .withMessage(
          'Execution Type must be either buy or sell (case sensitive)'
        ),
      check('userId').custom(async (value, { req }) => {
        return User.findOne({ id: value }).then(userDoc => {
          if (!userDoc) {
            return Promise.reject(`User with id : ${value} doesnt exist`);
          }
        });
      }),
      check('executionDate')
        .isISO8601()
        .toDate()
        .withMessage('Execution Date must be of format: YYYY-MM-DD HH:MM:SS'),
    ],
    updateTrade
  )
  .delete(
    [
      check('userId').custom(async (value, { req }) => {
        return User.findOne({ id: value }).then(userDoc => {
          if (!userDoc) {
            return Promise.reject(`User with id : ${value} doesnt exist`);
          }
        });
      }),
    ],
    deleteTrade
  );

module.exports = router;
