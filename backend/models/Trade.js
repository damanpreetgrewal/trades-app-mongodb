const mongoose = require('mongoose');

const tradeSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    ticker: {
      type: String,
      required: [true, 'Please add a Ticker/Stock Symbol field'],
      maxLength: 20,
    },
    amount: {
      type: Number,
      required: [true, 'Please add an Amount field'],
      min: [0, 'Amount has to be a postive Numeric number'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a Price field'],
      min: [0, 'Amount has to be a postive Numeric number'],
    },
    executionType: {
      type: String,
      required: [true, 'Please add a Execution Type field'],
      enum: ['buy', 'sell'],
    },
    executionDate: {
      type: Date,
      required: [true, 'Please add a Execution Date field'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trade', tradeSchema);
