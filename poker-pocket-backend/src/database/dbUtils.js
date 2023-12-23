'use strict';

const User = require('../models/user');
const Statistic = require('../models/statistic');

/**
 * Create new user if not exists
 * @param {String} username
 * @param {String} password
 * @param {String} email
 * @returns {Promise<any>}
 */
function CreateAccountPromise(username, password, email) {
  return User.findOne({name: username})
    .then(userObj => {
      if (userObj) {
        return {result: false};
      } else {
        const newUser = new User({
          name: username,
          password: password,
          email: email,
          money: 10000
        });

        return newUser.save()
          .then(() => {
            return {result: true};
          });
      }
    })
    .catch(error => {
      console.error('Error creating account:', error);
      throw error;
    });
}

exports.CreateAccountPromise = CreateAccountPromise;


/**
 * Find user for login
 * @param {String} username
 * @param {String} password
 * @returns {Promise<any>}
 */
function LoginPromise(username, password) {
  return User.findOne({name: username, password: password})
    .then(user => {
      if (user) {
        return {
          result: true,
          username: user.name,
          password: user.password
        };
      } else {
        return {
          result: false,
          username: null,
          password: null
        };
      }
    })
    .catch(error => {
      console.error('Error during login:', error);
      throw error;
    });
}

exports.LoginPromise = LoginPromise;


/**
 * Gets user parameters to user object
 * @param {String} username
 * @param {String} password
 * @returns {Promise<any>}
 */
function GetLoggedInUserParametersPromise(username, password) {
  return User.findOne({name: username, password: password})
    .then(user => {
      if (user) {
        return {
          result: true,
          id: user._id,
          name: user.name,
          money: user.money,
          win_count: user.win_count,
          lose_count: user.lose_count
        };
      } else {
        return {
          result: false,
          id: null,
          name: null,
          money: null,
          win_count: null,
          lose_count: null
        };
      }
    })
    .catch(error => {
      console.error('Error getting user parameters:', error);
      throw error;
    });
}

exports.GetLoggedInUserParametersPromise = GetLoggedInUserParametersPromise;


/**
 * Update player name
 * @param {Number} userId
 * @param {String} newName
 * @returns {Promise<any>}
 */
function UpdatePlayerNamePromise(userId, newName) {
  return User.findOneAndUpdate(
    { _id: userId },
    { name: newName },
    { new: true }
  )
    .then(updatedUser => {
      if (updatedUser) {
        return { result: true };
      } else {
        return { result: false };
      }
    })
    .catch(error => {
      console.error('Error updating player name:', error);
      throw error;
    });
}

exports.UpdatePlayerNamePromise = UpdatePlayerNamePromise;


/**
 * Update player current funds/money
 * @param {Number} userId
 * @param {Number} money
 * @returns {Promise<any>}
 */
function UpdatePlayerMoneyPromise(userId, money) {
  return User.findOneAndUpdate(
    { _id: userId },
    { money: money },
    { new: true }
  )
    .then(updatedUser => {
      if (updatedUser) {
        return { result: true };
      } else {
        return { result: false };
      }
    })
    .catch(error => {
      console.error('Error updating player money:', error);
      throw error;
    });
}

exports.UpdatePlayerMoneyPromise = UpdatePlayerMoneyPromise;

/**
 * Increment player win count
 * notice that this also needs event emitter for front end notification
 * @param {Object} eventEmitter
 * @param {Number} connectionId
 * @param {Number} userId
 * @param {Boolean} isWinStreak
 * @returns {Promise<any>}
 */
function UpdatePlayerWinCountPromise(eventEmitter, connectionId, userId, isWinStreak) {
  return User.findOneAndUpdate(
    { _id: userId },
    { $inc: { win_count: 1, xp: isWinStreak ? 200 : 100 } },
    { new: true }
  )
    .then(updatedUser => {
      if (updatedUser) {
        const incrementXp = isWinStreak ? 200 : 100;
        eventEmitter.emit('onXPGained', connectionId, incrementXp, `You won the round${isWinStreak ? ' (Win streak bonus)' : ''}`);
        return { result: true };
      } else {
        return { result: false };
      }
    })
    .catch(error => {
      console.error('Error updating player win count:', error);
      throw error;
    });
}

exports.UpdatePlayerWinCountPromise = UpdatePlayerWinCountPromise;


/**
 * Decrement player win count
 * @param {Number} userId
 * @returns {Promise<any>}
 */
function UpdatePlayerLoseCountPromise(userId) {
  return User.findOneAndUpdate(
    { _id: userId },
    { $inc: { lose_count: 1 } },
    { new: true }
  )
    .then(updatedUser => {
      if (updatedUser) {
        return { result: true };
      } else {
        return { result: false };
      }
    })
    .catch(error => {
      console.error('Error updating player lose count:', error);
      throw error;
    });
}

exports.UpdatePlayerLoseCountPromise = UpdatePlayerLoseCountPromise;


/**
 * Insert statistic line for own dedicated table
 * @param {Number} userId
 * @param {Number} money
 * @param {Number} win_count
 * @param {Number} lose_count
 * @returns {Promise<any>}
 */
function InsertPlayerStatisticPromise(userId, money, win_count, lose_count) {
  return Statistic.create({
    user_id: userId,
    money: money,
    win_count: win_count,
    lose_count: lose_count
  })
    .then(() => {
      return { result: true };
    })
    .catch(error => {
      console.error('Error inserting player statistic:', error);
      throw error;
    });
}

exports.InsertPlayerStatisticPromise = InsertPlayerStatisticPromise;


/**
 * User saw rewarding ad, increment money, ad count, xp
 * TODO: Needs validation implementation, user can call this method as cheat without checks for validity
 * Обновить информацию о показе вознаграждающей рекламы игроку
 * @param {Number} userId
 * @returns {Promise<any>}
 */
function UpdatePlayerRewardingAdShownPromise(userId) {
  return User.findOneAndUpdate(
    { _id: userId },
    {
      $inc: {
        money: 2000,             // Increment money
        rew_ad_count: 1,        // Increment shown ad
        xp: 100                 // Increment xp
      }
    },
    { new: true }
  )
    .then(updatedUser => {
      if (updatedUser) {
        return { result: true };
      } else {
        return { result: false };
      }
    })
    .catch(error => {
      console.error('Error updating player rewarding ad shown:', error);
      throw error;
    });
}

exports.UpdatePlayerRewardingAdShownPromise = UpdatePlayerRewardingAdShownPromise;


/**
 * Get user statistics for front end ui
 * or any other use case
 * @param {Number} userId
 * @returns {Promise<any>}
 */
function GetLoggedInUserStatisticsPromise(userId) {
  return User.findOne({ _id: userId })
    .then(user => {
      if (user) {
        return {
          result: true,
          id: user._id,
          name: user.name,
          money: user.money,
          win_count: user.win_count,
          lose_count: user.lose_count,
          xp: user.xp,
        };
      } else {
        return { result: false, id: null, name: null, money: null, win_count: null, lose_count: null, xp: null };
      }
    })
    .catch(error => {
      console.error('Error getting user statistics:', error);
      throw error;
    });
}

exports.GetLoggedInUserStatisticsPromise = GetLoggedInUserStatisticsPromise;


/**
 * Get all user ranks for viewing purposes
 * limited by 50 results, order by xp desc
 * @returns {Promise<any>}
 */
function GetRankingsPromise() {
  return User.find({})
    .sort({ xp: 'desc' })
    .limit(50)
    .select('name xp win_count lose_count')
    .lean()
    .then(users => {
      if (users.length > 0) {
        return { result: true, ranks: users };
      } else {
        return { result: false };
      }
    })
    .catch(error => {
      console.error('Error getting rankings:', error);
      throw error;
    });
}

exports.GetRankingsPromise = GetRankingsPromise;


/**
 * Get player chart statistic data for chart viewing
 * @param {Number} userId
 * @returns {Promise<any>}
 */
function GetPlayerChartDataPromise(userId) {
  return Statistic.find({ user_id: userId })
    .limit(150)
    .select('money win_count lose_count')
    .lean()
    .sort({ _id: 'desc' })
    .then(stats => {
      if (stats.length > 0) {
        // select result must be reversed but not by id asc, that causes old data,
        // desc brings new data but in wrong order .reverse() array fixes this
        return { result: true, ranks: stats.reverse() };
      } else {
        return { result: false, ranks: [] };
      }
    })
    .catch(error => {
      console.error('Error getting player chart data:', error);
      throw error;
    });
}

exports.GetPlayerChartDataPromise = GetPlayerChartDataPromise;

