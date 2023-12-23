const mongoose = require('mongoose');

const statisticSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  money: Number,
  win_count: Number,
  lose_count: Number,
});

const Statistic = mongoose.model('Statistic', statisticSchema);

module.exports = Statistic;
