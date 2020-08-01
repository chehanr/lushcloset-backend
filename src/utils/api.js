const slugify = require('slugify');

const apiConfig = require('../configs/api');

module.exports = {
  /**
   * Returns a slugified string.
   * @param  {String} stringToSlugify String to slugify.
   * @return {String}         Slug.
   */
  makeSlug(stringToSlugify) {
    if (!stringToSlugify) return '';

    return slugify(stringToSlugify, apiConfig.slugifySettings);
  },

  /**
   * Returns a string with no speacial chars.
   * @param  {String} stringToSlugify String to clean.
   * @return {String}                 Cleaned string.
   */
  cleanString(stringToClean) {
    if (!stringToClean) return '';

    return stringToClean.replace(/[^\w\s]/gim, '').trim();
  },

  /**
   * Returns a string truncated and ellipsised (...).
   * @param  {String} stringToTruncate   String to truncate.
   * @param  {Number} truncatedLength    String length to truncate to.
   * @param  {String} [ellipsisChar='.'] Char to ellipsise as.
   * @param  {Number} [ellipsisCount=3]  Number of ellipsise chars.
   * @return {String}                    Truncated string.
   */
  truncateString(
    stringToTruncate,
    truncatedLength,
    ellipsisChar = '.',
    ellipsisCount = 3
  ) {
    if (!stringToTruncate) return '';

    if (stringToTruncate.length > truncatedLength + ellipsisCount) {
      return `${stringToTruncate
        .slice(0, truncatedLength - ellipsisCount)
        .trim()}${ellipsisChar.repeat(ellipsisCount)}`;
    }

    return stringToTruncate;
  },
};
