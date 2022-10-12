const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const colors = require('colors');
const users = require('./data/users');
const dummyTrades = require('./data/trades');
const User = require('./models/User');
const Trade = require('./models/Trade');
const connectDb = require('./config/db');

//Connect to the 'trades-app' Database
connectDb();

const importData = async () => {
  try {
    await Trade.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const user = await User.find();

    let dummyTradesWithUserInfo = dummyTrades.map((trade, index) => {
      let userId = '';
      if (index % 2 === 0) {
        userId = user[0]._id;
      } else {
        userId = user[1]._id;
      }
      return {
        ...trade,
        userId,
      };
    });

    const createdTrades = await Trade.insertMany(dummyTradesWithUserInfo);

    console.log(`Data Imported!`.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};
const destroyData = async () => {
  try {
    await Trade.deleteMany();
    await User.deleteMany();

    console.log(`Data Destroyed!`.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
