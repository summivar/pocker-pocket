const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  xp: { type: Number, default: 0 },
  money: { type: Number, default: 0 },
  win_count: { type: Number, default: 0 },
  lose_count: { type: Number, default: 0 },
  rew_ad_count: { type: Number, default: 0 },
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
