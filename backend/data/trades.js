const trades = [
  {
    id: 1,
    ticker: 'AAPL',
    amount: 100,
    price: 20.55,
    executionType: 'buy',
    executionDate: new Date(2022, 00, 31),
  },
  {
    id: 2,
    ticker: 'GOOG',
    amount: 80,
    price: 40.99,
    executionType: 'buy',
    executionDate: new Date(2022, 01, 28),
  },
  {
    id: 3,
    ticker: 'MSFT',
    amount: 60,
    price: 60.45,
    executionType: 'sell',
    executionDate: new Date(2022, 02, 31),
  },
  {
    id: 4,
    ticker: 'UBS',
    amount: 40,
    price: 20.99,
    executionType: 'sell',
    executionDate: new Date(2022, 03, 30),
  },
  {
    id: 5,
    ticker: 'CS',
    amount: 20,
    price: 100.4,
    executionType: 'sell',
    executionDate: new Date(2022, 04, 31),
  },
  {
    id: 6,
    ticker: 'BNS',
    amount: 100,
    price: 50.99,
    executionType: 'buy',
    executionDate: new Date(2022, 05, 30),
  },
];

module.exports = trades;
