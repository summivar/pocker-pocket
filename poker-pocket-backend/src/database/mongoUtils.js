const mongoose = require('mongoose');
const dotEnv = require('dotenv');
dotEnv.config();

async function initDatabase() {
  try {
    await mongoose.connect(process.env.DB_URL);
  } catch (error) {
    console.error(error);
  }
}

exports.initDatabase = initDatabase;
