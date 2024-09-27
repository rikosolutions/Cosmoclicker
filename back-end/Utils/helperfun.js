const moment = require('moment');

/**
 * Returns the current UTC time in various formats based on the parameter.
 *
 * @param {string|null} [param=null] - Specifies the format of the returned UTC time.
 *                                     If 'timestamp', returns the UTC timestamp in milliseconds.
 *                                     If 'datetime', returns the UTC date-time string formatted as 'YYYY-MM-DD HH:mm:ss'.
 *                                     If null, returns a moment object representing the current UTC time.
 *                                     If any other value, returns null.
 * @return {number|string|Object|null} The current UTC time in the specified format or null for invalid parameter.
 * @return {number} [return] - The UTC timestamp in milliseconds if `param` is 'timestamp'.
 * @return {string} [return] - The formatted UTC date-time string if `param` is 'datetime'.
 * @return {Object} [return] - A moment object representing the current UTC time if `param` is null.
 * @return {null} [return] - Returns null for any other parameter value.
 */
function getUTCTime(param = null) {
    if (param === 'timestamp') {
        return moment().utc().valueOf(); // Returns the UTC timestamp
    } else if (param === 'datetime') {
        return moment().utc().format('YYYY-MM-DD HH:mm:ss');
    } else if (param === null) {
        return moment().utc();
    } else {
        return null;
    }
}


/**
 * Converts a given date-time string to UTC format.
 *
 * @param  {string} dateTimeString - The date-time string to convert.
 * @return {Object} An object containing the formatted UTC date-time string and the corresponding timestamp.
 * @return {string} return.formattedDateTime - The formatted UTC date-time string.
 * @return {number} return.timestamp - The UTC timestamp in milliseconds.
 */
function convertDateTimeToUTC(dateTimeString) {
    const formattedDateTime = moment(dateTimeString).utc().format('YYYY-MM-DD HH:mm:ss');
    const timestamp = moment(dateTimeString).utc().valueOf();
    return {
        formattedDateTime: formattedDateTime,
        timestamp: timestamp
    };
}

module.exports = {
    getUTCTime,
    convertDateTimeToUTC
};