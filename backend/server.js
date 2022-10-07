const express = require('express');
var cors = require('cors');
const colors = require('colors');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 8000;

const { errorHandler } = require('./middleware/errorMiddleware');
const errorController = require('./controllers/error');
const connectDb = require('./config/db');
const tradesroutes = require('./routes/tradesRoutes.js');
const queryRoutes = require('./routes/queryRoutes');

const app = express();

//Connect to the 'trades-app' Database
connectDb();

//Enable All CORS Requests
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/trades', tradesroutes);
app.use('/api/query', queryRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(errorController.get404);
app.use(errorHandler);

app.listen(
  port,
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${port} `.yellow
      .bold
  )
);
