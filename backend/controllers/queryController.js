const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Trade = require('../models/Trade');
const User = require('../models/User');
const formatDate = require('../utils/formatDate');

// @desc Get Trades Summary
// @route GET /api/query
// @access Public
const getTradesSummary = asyncHandler(async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.validationErrors = errors.errors;
      error.statusCode = 422;
      throw error;
    }

    let filter = { verified: true };

    if (req.body.executionType)
      filter = { ...filter, executionType: req.body.executionType };
    if (req.body.executionStartDate && req.body.executionEndDate)
      filter = {
        ...filter,
        executionDate: {
          $gte: req.body.executionStartDate,
          $lte: req.body.executionEndDate,
        },
      };
    if (req.body.executionStartDate && !req.body.executionEndDate)
      filter = {
        ...filter,
        executionDate: { $gte: req.body.executionStartDate },
      };
    if (!req.body.executionStartDate && req.body.executionEndDate)
      filter = {
        ...filter,
        executionDate: { $lte: req.body.executionEndDate },
      };
    let filteredTrades = await Trade.find(filter)
      .populate('userId')
      .sort({ createdAt: -1 });

    if (req.body.userId) {
      filteredTrades = filteredTrades.filter(
        trade => trade.userId.id === Number(req.body.userId)
      );
    }

    console.log(filteredTrades);

    filteredTrades = filteredTrades.map(trade => {
      return {
        id: trade.id,
        ticker: trade.ticker,
        amount: trade.amount,
        price: trade.price,
        executionType: trade.executionType,
        exeutionDate: formatDate(trade.executionDate),
        userId: trade.userId.id,
        name: trade.userId.name,
      };
    });

    res.status(200).json(filteredTrades);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

module.exports = { getTradesSummary };
