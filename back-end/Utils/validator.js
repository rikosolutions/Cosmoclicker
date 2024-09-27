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


module.exports = {
  isMobileDevice
};
