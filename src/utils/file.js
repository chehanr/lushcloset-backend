const { v4: uuidv4 } = require('uuid');

const serverConfig = require('../configs/server');

module.exports = {
  /**
   * Returns a file's name and extention.
   * @param  {String} fileName
   * @return {Object}           {name, ext}
   */
  explodeFileName(fileName) {
    const parts = fileName.split('.');

    const ext = parts.pop();

    return { name: parts.join('.'), ext };
  },

  /**
   * Returns a (hopefully) unique file name.
   * @param  {String} fileExtension       File extension
   * @param  {Array}  [prefixes=[]]       Array of prefixes
   * @param  {String} [concatChar='_']    Char to concat file name parts with
   * @return {String}
   */
  generateFileName(fileExtension, prefixes = [], concatChar = '_') {
    const uuid = uuidv4();

    const name = `${prefixes.join(
      concatChar
    )}${concatChar}${uuid}.${fileExtension}`;

    return name;
  },

  /**
   * Returns a full url for a file link object.
   * @param  {Object} fileLinkObj   FileLinkObject
   * @return {String}
   */
  getFileLinkUrl(fileLinkObj) {
    let url = '';

    switch (fileLinkObj.storageProvider) {
      case 'b2':
        url = url.concat(
          `https://${fileLinkObj.storageBucketName}.${serverConfig.b2BucketEndpoint}/${fileLinkObj.fileName}`
        );
        break;

      default:
        break;
    }

    return url;
  },
};
