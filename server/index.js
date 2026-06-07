require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const ordersRouter = require('./routes/orders');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/cakeshop';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((e) => console.error('MongoDB connection error', e));

app.use('/orders', ordersRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Orders API running on port ${PORT}`));
