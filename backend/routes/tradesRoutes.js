const { body, check } = require('express-validator');
const express = require('express');
const router = express.Router();

const {
  getTrades,
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
      body('userId')
        .not()
        .isEmpty()
        .withMessage('UserId is required')
        .matches(/^[0-9]+$/)
        .withMessage('UserId must be a postive Integer'),
      check('executionDate')
        .isISO8601()
        .toDate()
        .withMessage('Execution Date must be of format: YYYY-MM-DD HH:MM:SS'),
    ],
    postTrade
  );

router
  .route('/:id')
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
      body('userId')
        .not()
        .isEmpty()
        .withMessage('UserId is required')
        .matches(/^[0-9]+$/)
        .withMessage('UserId must be a postive Integer'),
      check('executionDate')
        .isISO8601()
        .toDate()
        .withMessage('Execution Date must be of format: YYYY-MM-DD HH:MM:SS'),
    ],
    updateTrade
  )
  .delete(
    [
      body('userId')
        .not()
        .isEmpty()
        .withMessage('UserId is required')
        .matches(/^[0-9]+$/)
        .withMessage('UserId must be a postive Integer'),
    ],
    deleteTrade
  );

module.exports = router;
