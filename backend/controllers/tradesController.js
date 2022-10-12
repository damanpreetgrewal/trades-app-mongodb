const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Trade = require('../models/Trade');
const User = require('../models/User');
const formatDate = require('../utils/formatDate');

// @desc Get all Trades
// @route GET /api/trades
// @access Public
const getTrades = asyncHandler(async (req, res, next) => {
  try {
    const trades = await Trade.find().populate('userId');
    if (trades.length === 0) {
      return res.status(200).json({ message: 'No Trades found.' });
    }
    const transformedTrades = trades.map(trade => {
      return {
        id: trade.id,
        ticker: trade.ticker,
        amount: trade.amount,
        price: trade.price,
        executionType: trade.executionType,
        exectionDate: formatDate(trade.executionDate),
        userId: trade.userId.id,
        name: trade.userId.name,
        recordCreatedAt: formatDate(trade.createdAt),
        recordUpdatedAt: formatDate(trade.updatedAt),
      };
    });
    res.status(200).json(transformedTrades);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

// @desc Post a trade
// @route POST /api/trades
// @access Public
const postTrade = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.validationErrors = errors.errors;
    error.statusCode = 422;
    throw error;
  }

  try {
    const user = await User.findOne({ id: req.body.userId });

    const countofTradesBefore = await Trade.find().count();

    const trade = await Trade.create({
      id: countofTradesBefore + 1,
      ticker: req.body.ticker,
      amount: req.body.amount,
      price: req.body.price,
      executionType: req.body.executionType,
      userId: user._id,
      executionDate: req.body.executionDate,
    });

    const populatedTradeData = await Trade.findOne({ _id: trade._id }).populate(
      'userId'
    );

    res.status(201).json({
      message: 'Trade posted successfully.',
      trade: {
        id: populatedTradeData.id,
        ticker: populatedTradeData.ticker,
        amount: populatedTradeData.amount,
        price: populatedTradeData.price,
        executionType: populatedTradeData.executionType,
        exectionDate: formatDate(populatedTradeData.executionDate),
        userId: populatedTradeData.userId.id,
        name: populatedTradeData.userId.name,
        recordCreatedAt: formatDate(populatedTradeData.createdAt),
        recordUpdatedAt: formatDate(populatedTradeData.updatedAt),
      },
    });
  } catch (err) {
    next(err);
  }
});

// @desc Update a trade
// @route PUT /api/trades/:id
// @access Public
const updateTrade = asyncHandler(async (req, res, next) => {
  const trade = await Trade.findOne({ id: req.params.id }).populate('userId');

  if (!trade) {
    res.status(404);
    throw new Error(`Trade with id: ${req.params.id} not found.`);
  }
  //Make sure the userId of the Trade matches the userId in the DB
  if (trade.userId.id !== req.body.userId) {
    res.status(401);
    throw new Error('User who does not own the trade cannot update the trade');
  }

  if (trade.executionDate < new Date()) {
    res.status(401);
    throw new Error(
      'Trades that have Execution Date in the past cannot be updated'
    );
  }

  const toBeUpdatedTradeData = {
    ticker: req.body.ticker,
    amount: req.body.amount,
    price: req.body.price,
    executionType: req.body.executionType,
    executionDate: req.body.exectionDate,
  };

  const updatedTrade = await Trade.findByIdAndUpdate(
    trade._id,
    { $set: toBeUpdatedTradeData },
    { new: true }
  ).populate('userId');

  res.status(200).json({
    message: 'Trade updated successfully.',
    trade: {
      id: updatedTrade.id,
      ticker: updatedTrade.ticker,
      amount: updatedTrade.amount,
      price: updatedTrade.price,
      executionType: updatedTrade.executionType,
      exectionDate: formatDate(updatedTrade.executionDate),
      userId: updatedTrade.userId.id,
      name: updatedTrade.userId.name,
      recordCreatedAt: formatDate(updatedTrade.createdAt),
      recordUpdatedAt: formatDate(updatedTrade.updatedAt),
    },
  });
});

// @desc Delete a Trade
// @route DELETE /api/trades/:id
// @access Public
const deleteTrade = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.validationErrors = errors.errors;
    error.statusCode = 422;
    throw error;
  }
  try {
    const trade = await Trade.findOne({ id: req.params.id }).populate('userId');
    if (!trade) {
      res.status(404);
      throw new Error('Trade not found');
    }
    //Make sure the userId of the Trade matches the userId in the DB
    if (trade.userId.id !== req.body.userId) {
      res.status(401);
      throw new Error(
        'User who does not own the trade cannot delete the trade'
      );
    }

    if (trade.executionDate < new Date()) {
      res.status(401);
      throw new Error(
        'Trades that have Execution Date in the past cannot be deleted'
      );
    }

    const deletedTrade = await Trade.findByIdAndDelete(trade._id).populate(
      'userId'
    );
    console.log(deletedTrade);
    res.status(200).json({
      message: 'Trade deleted successfully.',
      trade: {
        id: deletedTrade.id,
        ticker: deletedTrade.ticker,
        amount: deletedTrade.amount,
        price: deletedTrade.price,
        executionType: deletedTrade.executionType,
        exectionDate: formatDate(deletedTrade.executionDate),
        userId: deletedTrade.userId.id,
        name: deletedTrade.userId.name,
        recordCreatedAt: formatDate(deletedTrade.createdAt),
        recordUpdatedAt: formatDate(deletedTrade.updatedAt),
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = { getTrades, postTrade, updateTrade, deleteTrade };
