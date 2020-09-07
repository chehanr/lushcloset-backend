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
   * @param  {String} inputText             String to truncate
   * @param  {Number} width                 String length to truncate to
   * @param  {String} [char='.']            Char to ellipsise as
   * @param  {Number} [charCount=3]         Number of ellipsise chars
   * @return {String}                       Truncated string
   */
  truncateString(inputText, width, char = '.', charCount = 3) {
    let result = '';

    if (!inputText) return result;

    if (inputText.length <= width) {
      return inputText;
    }

    let truncatedString;

    if (width - charCount <= 0) {
      truncatedString = inputText.slice(0, width);

      result = `${truncatedString} [${char.repeat(charCount)}]`;
    } else {
      truncatedString = inputText.slice(0, width - charCount);

      result = `${truncatedString}${char.repeat(charCount)}`;
    }

    return result;
  },
};
