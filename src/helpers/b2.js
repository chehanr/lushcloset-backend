const B2 = require('backblaze-b2');
const fs = require('fs');

const serverConfig = require('../configs/server');

module.exports = class B2Helper {
  constructor() {
    this.b2 = new B2({
      applicationKeyId: serverConfig.b2KeyId,
      applicationKey: serverConfig.b2AppKey,
    });
  }

  async authorize() {
    await this.b2.authorize();
  }

  async getBucket(bucketName, bucketId) {
    const res = await this.b2.getBucket({ bucketName, bucketId });
    const { buckets } = res.data;

    return buckets[0];
  }

  async getUploadUrl(bucketId) {
    const res = await this.b2.getUploadUrl({ bucketId });

    return res.data;
  }

  async getFileInfo(fileId) {
    const res = await this.b2.getFileInfo({ fileId });

    return res.data;
  }

  async uploadFile(uploadUrl, uploadAuthToken, file, opts = {}) {
    const res = await this.b2.uploadFile({
      uploadUrl: uploadUrl,
      uploadAuthToken: uploadAuthToken,
      fileName: file.name,
      mime: file.type,
      data: fs.readFileSync(file.path),
      ...opts,
    });

    return res.data;
  }
};
