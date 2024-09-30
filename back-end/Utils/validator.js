const moment = require("moment");
const _ = require("lodash");

/**
 * Checks if the current device is a mobile device based on the user agent string.
 * In development mode, always returns true.
 *
 * @param  {string} userAgent - The user agent string to be tested.
 * @return {boolean} Returns true if the device is a mobile device or if in development mode; otherwise, returns false.
 */
function isMobileDevice(userAgent) {
  if (process.env.MODE == "dev") return true;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

function getTapScore(req, earnings) {
  var isClientScore = false;
  var clientScore = !_.isNil(req.headers.score)
    ? parseInt(req.headers.score)
    : 0;
  clientScore = !isNaN(clientScore) ? clientScore : 0;
  var serverScore =
    earnings.tap_score === null ? 0 : parseInt(earnings.tap_score);
  var tapScore = serverScore;

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`******{path: "${req.path}", userid: "${earnings.userid}", ip: "${ip}", clientscore: "${clientScore}", serverscore: "${serverScore}", currenttime: "${moment.utc().toDate()}", last_tap_at: "${earnings.last_tap_at}", created_date: "${earnings.created_date}", last_mine_at: "${earnings.last_mine_at}"}******`);

  if (clientScore > 0) {
    var lastTapAt =
      earnings.last_tap_at !== null
        ? earnings.last_tap_at
        : earnings.created_date;

    lastTapAt = moment.utc(lastTapAt);
    var currentTime = moment.utc();
    var diffInSec = currentTime.diff(lastTapAt, "seconds");
    diffInSec = diffInSec > 1800 ? 1800 : diffInSec;
    var maxScore = diffInSec * 50;
    var currentScore = clientScore - serverScore;
    if (currentScore > 0) {
      if (maxScore >= currentScore) {
        tapScore = clientScore;
        isClientScore = true;
      }
    }
  }
  return [tapScore, isClientScore];
}


module.exports = {
  isMobileDevice,
  getTapScore
  
};
