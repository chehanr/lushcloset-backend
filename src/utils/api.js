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
};
