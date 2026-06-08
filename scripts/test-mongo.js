const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cakeshop';

(async () => {
  try {
    console.log('Trying to connect to:', uri);
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error('MongoDB connection error:');
    console.error(e && e.message ? e.message : e);
    process.exit(1);
  }
})();
