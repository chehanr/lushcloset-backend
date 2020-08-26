const BaseController = require('./base');
const B2Helper = require('../helpers/b2');
const models = require('../models');
const serverConfig = require('../configs/server');
const fileUtils = require('../utils/file');
const { errorResponses } = require('../constants/errors');

const STATIC_UPLOAD_PATH = 'static/uploads';
const ALLOWED_LISTING_IMAGE_FILE_TYPES = ['image/jpeg'];
const ALLOWED_USER_AVATAR_FILE_TYPES = ['image/jpeg'];

async function createFileObj(userId, purpose, transaction) {
  return models.File.create({ userId, purpose }, { transaction });
}

async function createFileLinkObj(
  fileObj,
  uploadedFile,
  storageProvider,
  storageBucketName,
  metadata,
  transaction
) {
  return models.FileLink.create(
    {
      fileId: fileObj.id,
      storageProvider,
      storageBucketName,
      storageFileId: uploadedFile.fileId,
      fileName: uploadedFile.fileName,
      fileSize: uploadedFile.contentLength,
      fileContentType: uploadedFile.contentType,
      metadata: metadata,
      uploadedAt: uploadedFile.uploadTimestamp,
    },
    { transaction }
  );
}

async function handleB2Upload(file) {
  const fileToUpload = file;

  const b2 = new B2Helper();

  await b2.authorize();

  let bucket = await b2.getBucket(serverConfig.b2BucketName);
  bucket = await b2.getUploadUrl(bucket.bucketId);

  // Override name with the upload path.
  fileToUpload.name = `${STATIC_UPLOAD_PATH}/${fileToUpload.name}`;

  return b2.uploadFile(
    bucket.uploadUrl,
    bucket.authorizationToken,
    fileToUpload,
    {
      info: { ...fileToUpload.metadata },
    }
  );
}

async function uploadOriginalFile(file) {
  const receivedFile = file;

  let uploadedFile;

  // TODO: Add other providers later.
  switch (serverConfig.storageProvider) {
    case 'B2':
      receivedFile.metadata = {
        original: true,
      };

      uploadedFile = await handleB2Upload(receivedFile);

      break;

    default:
      break;
  }

  return uploadedFile;
}

class FileController extends BaseController {
  /**
   * Handle file uploads.
   */
  async createFile(req, res) {
    let errorResponseObj;

    if (req.validated.files?.error) {
      errorResponseObj = errorResponses.validationFileError;
      errorResponseObj.extra = req.validated.files.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    if (req.validated.body?.error) {
      errorResponseObj = errorResponses.validationBodyError;
      errorResponseObj.extra = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    const body = req.validated.body.value;
    const files = req.validated.files.value;
    const receivedFile = files.file;

    switch (body.purpose) {
      case 'listing_image':
        if (!ALLOWED_LISTING_IMAGE_FILE_TYPES.includes(receivedFile.type)) {
          return this.badRequest(res, 'Bad file type');
        }

        break;

      case 'user_avatar':
        if (!ALLOWED_USER_AVATAR_FILE_TYPES.includes(receivedFile.type)) {
          return this.badRequest(res, 'Bad file type');
        }

        break;
      default:
        return this.badRequest(res);
    }

    let newfileObj;
    let newfileLinkObj;
    let uploadedFile;

    try {
      await models.sequelize.transaction(async (t) => {
        newfileObj = await createFileObj(req.user.id, body.purpose, t);

        const { ext: fileExt } = fileUtils.explodeFileName(receivedFile.name);

        switch (newfileObj.purpose) {
          case 'listing_image':
            // The file name should look like \
            // `listing-image_$fileObj-uuid$_$userObj-uuid$_$new-uuid$.jpeg`
            receivedFile.name = fileUtils.generateFileName(fileExt, [
              'listing-image',
              newfileObj.id,
              req.user.id,
            ]);
            break;

          case 'user_avatar':
            // The file name should look like \
            // `user-avatar_$fileObj-uuid$_$userObj-uuid$_$new-uuid$.jpeg`
            receivedFile.name = fileUtils.generateFileName(fileExt, [
              'user-avatar',
              newfileObj.id,
              req.user.id,
            ]);
            break;

          default:
            break;
        }

        // Add to a job queue?
        uploadedFile = await uploadOriginalFile(receivedFile);

        newfileLinkObj = await createFileLinkObj(
          newfileObj,
          uploadedFile,
          serverConfig.storageProvider.toLowerCase(),
          serverConfig.b2BucketName,
          uploadedFile.fileInfo, // save provided file info for now.
          t
        );

        // TODO: Add job queue for making smaller/ compressed varients \
        // of the original image.
      });
    } catch (error) {
      // TODO delete static file if exists.
      return this.fail(res, error);
    }

    const fileOwnerObj = await newfileObj.getUser();

    const responseObj = {
      id: newfileObj.id,
      purpose: newfileObj.purpose,
      uploadedBy: {
        id: fileOwnerObj.id,
        name: fileOwnerObj.name,
      },
      links: [
        {
          id: newfileLinkObj.id,
          storageProvider: newfileLinkObj.storageProvider,
          storageBucketName: newfileLinkObj.storageBucketName,
          storageFileId: newfileLinkObj.storageFileId,
          fileName: newfileLinkObj.fileName,
          fileSize: newfileLinkObj.fileSize,
          fileContentType: newfileLinkObj.fileContentType,
          url: fileUtils.getFileLinkUrl(newfileLinkObj),
          metadata: newfileLinkObj.metadata,
          uploadedAt: newfileLinkObj.uploadedAt,
          expiresAt: newfileLinkObj.expiresAt,
          createdAt: newfileLinkObj.createdAt,
          updatedAt: newfileLinkObj.updatedAt,
        },
      ],
      createdAt: newfileObj.createdAt,
      updatedAt: newfileObj.updatedAt,
    };

    return this.created(res, responseObj);
  }

  /**
   * Get a file. \
   * With `fileId`.
   */
  async getFile(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    const params = req.validated.params.value;

    const fileObj = await models.File.findByPk(params.fileId, {
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: ['id', 'name'],
        },
        {
          model: models.FileLink,
          as: 'fileLinks',
        },
      ],
    });

    if (!fileObj) {
      return this.notFound(res);
    }

    const responseObj = {
      id: fileObj.id,
      purpose: fileObj.purpose,
      uploadedBy: {
        id: fileObj.user.id,
        name: fileObj.user.name,
      },
      links: [],
      createdAt: fileObj.createdAt,
      updatedAt: fileObj.updatedAt,
    };

    fileObj.fileLinks.forEach((fileLink) => {
      responseObj.links.push({
        id: fileLink.id,
        storageProvider: fileLink.storageProvider,
        storageBucketName: fileLink.storageBucketName,
        storageFileId: fileLink.storageFileId,
        fileName: fileLink.fileName,
        fileSize: fileLink.fileSize,
        fileContentType: fileLink.fileContentType,
        url: fileUtils.getFileLinkUrl(fileLink),
        metadata: fileLink.metadata,
        uploadedAt: fileLink.uploadedAt,
        expiresAt: fileLink.expiresAt,
        createdAt: fileLink.createdAt,
        updatedAt: fileLink.updatedAt,
      });
    });

    return this.ok(res, responseObj);
  }
}

module.exports = new FileController();
