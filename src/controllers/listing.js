const BaseController = require('./base');
const models = require('../models');
const googleMapsHelper = require('../helpers/google-maps');
const B2Helper = require('../helpers/b2');
const googleMapsUtils = require('../utils/google-maps');
const apiUtils = require('../utils/api');
const fileUtils = require('../utils/file');
const apiConfig = require('../configs/api');
const serverConfig = require('../configs/server');
const { errorResponses } = require('../constants/errors');
const { ORDER_BY_LAT_LNG_QUERY } = require('../constants/regex');

class ListingController extends BaseController {
  /**
   * Create a listing.
   */
  async createListingItem(req, res) {
    let errorResponseData;

    if (req.validated.body?.error) {
      errorResponseData = errorResponses.validationBodyError;
      errorResponseData.extra = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseData);
    }

    const {
      title,
      description,
      listingType,
      address,
      addressNote,
      priceValue,
      currencyTypeIso,
      imageFileId,
      categoryRefId,
      size,
      brandName,
      condition,
    } = req.validated.body.value;

    const geocodingData = [];

    try {
      geocodingData.push(...(await googleMapsHelper.getGeocodingData(address)));
    } catch (error) {
      return this.fail(res, error);
    }

    if (geocodingData.length === 0) {
      return this.badRequest(
        res,
        errorResponses.unprocessableLocationAddressError
      );
    }

    const fileIds = [];

    if (Array.isArray(imageFileId)) {
      fileIds.push(...imageFileId);
    } else {
      fileIds.push(imageFileId);
    }

    const fileObjs = [];
    let listingCategoryRefObj;

    try {
      fileObjs.push(
        ...(await models.File.findAll({
          where: {
            id: fileIds,
            userId: req.user.id,
            purpose: 'listing_image',
          },
          attributes: ['id'],
        }))
      );

      listingCategoryRefObj = await models.ListingCategoryRef.findByPk(
        categoryRefId
      );
    } catch (error) {
      return this.fail(res, error);
    }

    if (fileObjs.length === 0) {
      errorResponseData = errorResponses.noImagesForListingError;
      return this.badRequest(res, errorResponseData);
    }

    if (!listingCategoryRefObj) {
      errorResponseData = errorResponses.listingCategoryRefNotFoundError;
      return this.notFound(res, errorResponseData);
    }

    let listingObj;

    try {
      await models.sequelize.transaction(async (transaction) => {
        listingObj = await models.Listing.create(
          {
            title: title,
            description: description,
            listingType: listingType,
            userId: req.user.id,
            listingPrice: {
              value: priceValue,
              currencyTypeIso: currencyTypeIso,
            },
            listingAddress: {
              submittedAddress: address,
              formattedAddress: geocodingData[0].formatted_address,
              googleGeocodingData: geocodingData[0],
              note: addressNote,
            },
            listingStatus: {
              statusType: 'available',
            },
            listingImages: [
              ...fileObjs.map((fileObj, index) => ({
                fileId: fileObj.id,
                orderIndex: index,
              })),
            ],
            listingCategory: {
              listingCategoryRefId: listingCategoryRefObj.id,
            },
            listingMetadata: {
              size: size,
              brandName: brandName,
              condition: condition,
            },
          },
          {
            include: [
              {
                model: models.ListingPrice,
                as: 'listingPrice',
              },
              {
                model: models.ListingAddress,
                as: 'listingAddress',
              },
              {
                model: models.ListingStatus,
                as: 'listingStatus',
              },
              {
                model: models.ListingImage,
                as: 'listingImages',
              },
              {
                model: models.ListingCategory,
                as: 'listingCategory',
              },
              {
                model: models.ListingMetadata,
                as: 'listingMetadata',
              },
            ],
            transaction,
          }
        );

        listingObj.user = await listingObj.getUser({ transaction });

        listingObj.listingCategory = await listingObj.getListingCategory({
          include: [
            {
              model: models.ListingCategoryRef,
              as: 'listingCategoryRef',
            },
          ],
          transaction,
        });

        listingObj.listingImages = await listingObj.getListingImages({
          order: [
            ['orderIndex', 'ASC'],
            ['createdAt', 'DESC'],
          ],
          include: [
            {
              model: models.File,
              as: 'file',
              where: {
                purpose: 'listing_image',
              },
              include: [
                {
                  model: models.FileLink,
                  as: 'fileLinks',
                },
              ],
            },
          ],
          transaction,
        });
      });
    } catch (error) {
      return this.fail(res, error);
    }

    let addressComponents;
    let approxAddressComponents;
    let shortDescription;
    let formattedApproxAddress;

    try {
      addressComponents = googleMapsUtils.getAddressComponents(
        geocodingData[0]
      );

      approxAddressComponents = googleMapsUtils.getAddressComponents(
        geocodingData[0],
        true
      );

      shortDescription = apiUtils.truncateString(
        apiUtils.cleanString(listingObj.description),
        256
      );

      formattedApproxAddress = googleMapsUtils.getFormattedAddress(
        approxAddressComponents
      );
    } catch (error) {
      return this.fail(res, error);
    }

    const responseData = {
      id: listingObj.id,
      title: listingObj.title,
      shortDescription: shortDescription,
      description: listingObj.description,
      listingType: listingObj.listingType,
      status: listingObj.listingStatus.statusType,
      price: {
        value: listingObj.listingPrice.value,
        currencyTypeIso: listingObj.listingPrice.currencyTypeIso,
      },
      createdBy: {
        id: listingObj.user.id,
        name: listingObj.user.name,
      },
      approximateLocation: {
        formattedAddress: formattedApproxAddress,
        addressComponents: approxAddressComponents,
      },
      preciseLocation: {
        submittedAddress: listingObj.listingAddress.submittedAddress,
        formattedAddress: listingObj.listingAddress.formattedAddress,
        addressComponents: addressComponents,
        geographic: {
          lat:
            listingObj.listingAddress.googleGeocodingData?.geometry?.location
              .lat || null,
          lng:
            listingObj.listingAddress.googleGeocodingData?.geometry?.location
              .lng || null,
        },
        googlePlaceId:
          // eslint-disable-next-line camelcase
          listingObj.listingAddress.googleGeocodingData?.place_id || null,
        note: listingObj.listingAddress.note || null,
      },
      category: {
        ref: {
          id: listingObj.listingCategory.listingCategoryRef.id,
          name: listingObj.listingCategory.listingCategoryRef.name,
        },
      },
      metaData: {
        size: listingObj.listingMetadata.size,
        brandName: listingObj.listingMetadata.brandName,
        condition: listingObj.listingMetadata.condition,
      },
      images: [],
      createdAt: listingObj.createdAt,
      updatedAt: listingObj.updatedAt,
    };

    listingObj.listingImages.forEach((listingImageObj) => {
      const image = {
        id: listingImageObj.id,
        orderIndex: listingImageObj.orderIndex || 0,
        file: {
          id: listingImageObj.file.id,
          links: [],
        },
      };

      listingImageObj.file.fileLinks.forEach((fileLinkObj) => {
        image.file.links.push({
          id: fileLinkObj.id,
          fileSize: fileLinkObj.fileSize,
          fileContentType: fileLinkObj.fileContentType,
          url: fileUtils.getFileLinkUrl(fileLinkObj),
          metadata: fileLinkObj.metadata || {},
        });
      });

      responseData.images.push(image);
    });

    return this.created(res, responseData);
  }

  /**
   * Retrieve a listing \
   * with params `listingId`.
   */
  async retrieveListingItem(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const listingObj = await models.Listing.findByPk(
        req.validated.params.value.listingId,
        {
          include: [
            {
              model: models.User,
              as: 'user',
            },
            {
              model: models.ListingAddress,
              as: 'listingAddress',
            },
            {
              model: models.ListingPrice,
              as: 'listingPrice',
            },
            {
              model: models.ListingStatus,
              as: 'listingStatus',
            },
          ],
        }
      );

      if (listingObj) {
        const geocodingData = listingObj.listingAddress.googleGeocodingData;

        const addressComponentsObj = googleMapsUtils.getAddressComponents(
          geocodingData
        );

        const approxAddressComponentsObj = googleMapsUtils.getAddressComponents(
          geocodingData,
          true
        );

        const shortDescription = apiUtils.truncateString(
          apiUtils.cleanString(listingObj.description),
          256
        );

        const responseObj = {
          id: listingObj.id,
          title: listingObj.title,
          shortDescription: shortDescription,
          description: listingObj.description,
          listingType: listingObj.listingType,
          price: {
            value: listingObj.listingPrice.value,
            currencyTypeIso: listingObj.listingPrice.currencyTypeIso,
          },
          user: {
            id: listingObj.user.id,
            name: listingObj.user.name,
          },
          approximateLocation: {
            formattedAddress: googleMapsUtils.getFormattedAddress(
              approxAddressComponentsObj
            ),
            addressComponents: approxAddressComponentsObj,
          },
          preciseLocation: {
            submittedAddress: listingObj.listingAddress.submittedAddress,
            formattedAddress: listingObj.listingAddress.formattedAddress,
            addressComponents: addressComponentsObj,
            geographic: {
              lat:
                listingObj.listingAddress.googleGeocodingData?.geometry
                  ?.location.lat || null,
              lng:
                listingObj.listingAddress.googleGeocodingData?.geometry
                  ?.location.lng || null,
            },
            googlePlaceId:
              // eslint-disable-next-line camelcase
              listingObj.listingAddress.googleGeocodingData?.place_id || null,
            note: listingObj.listingAddress.note || null,
          },
          status: listingObj.listingStatus.statusType,
          createdAt: listingObj.createdAt,
          updatedAt: listingObj.updatedAt,
        };

        if (listingObj.userId !== req.user?.id) {
          // If user isn't creator.

          responseObj.preciseLocation = null;
        }

        return this.ok(res, responseObj);
      }

      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Retrieve a list of listings.
   * TODO: Super buggy!
   */
  async retrieveListingList(req, res) {
    let errorResponseData;

    if (req.validated.query?.error) {
      errorResponseData = errorResponses.validationQueryError;
      errorResponseData.extra = req.validated.query.error;

      return this.unprocessableEntity(res, errorResponseData);
    }

    const {
      orderBy,
      filterBy,
      titleiLike,
      priceGte,
      priceLte,
      currencyTypeIso,
      userId,
      categoryRefId,
      orderByLatLng,
      limit,
      offset,
    } = req.validated.query.value;

    const orderQuery = [];
    const whereQuery = {
      listing: {},
      listingStatus: {},
      listingPrice: {},
      listingCategory: {},
      user: {},
    };
    const paginationQuery = {
      limit: apiConfig.defaultPaginationLimit,
      offset: 0,
    };
    const attributes = [];

    try {
      if (orderBy && Array.isArray(orderBy)) {
        orderBy.forEach((val) => {
          switch (val) {
            case 'priceValue':
              orderQuery.push(['listingPrice', 'value', 'ASC']);
              break;
            case '-priceValue':
              orderQuery.push(['listingPrice', 'value', 'DESC']);
              break;
            case 'createdAt':
              orderQuery.push(['createdAt', 'ASC']);
              break;
            case '-createdAt':
              orderQuery.push(['createdAt', 'DESC']);
              break;
            case 'updatedAt':
              orderQuery.push(['updatedAt', 'ASC']);
              break;
            case '-updatedAt':
              orderQuery.push(['updatedAt', 'DESC']);
              break;
            default:
              break;
          }
        });
      } else {
        // Order by `createdAt` by default.
        orderQuery.push(['createdAt', 'DESC']);
      }

      if (orderByLatLng) {
        // UGLY AF.
        const matches = ORDER_BY_LAT_LNG_QUERY.exec(orderByLatLng);
        const lat = parseFloat(matches[1]);
        const lng = parseFloat(matches[4]);

        const distanceSubQuery = models.sequelize.fn(
          'earth_distance',
          models.sequelize.fn(
            'll_to_earth',
            models.sequelize.literal(
              `(SELECT CAST("listingAddress".google_geocoding_data->'geometry'->'location'->>'lat' as float8))`
            ),
            models.sequelize.literal(
              `(SELECT CAST("listingAddress".google_geocoding_data->'geometry'->'location'->>'lng' as float8))`
            )
          ),
          models.sequelize.fn('ll_to_earth', lat, lng)
        );

        attributes.push([distanceSubQuery, 'distance']);

        orderQuery.push([models.sequelize.literal('"distance"'), 'DESC']);
      }

      if (filterBy && Array.isArray(filterBy)) {
        filterBy.forEach((val) => {
          switch (val) {
            case 'isRentable':
              whereQuery.listing.listingType = 'rent';
              break;
            case 'isPurchasable':
              whereQuery.listing.listingType = 'sell';
              break;
            case 'isAvailable':
              whereQuery.listingStatus.statusType = 'available';
              break;
            case '-isAvailable':
              whereQuery.listingStatus.statusType = {
                [models.Sequelize.Op.not]: 'available',
              };
              break;
            default:
              break;
          }
        });
      } else {
        // Only show available listings by default.
        whereQuery.listingStatus.statusType = 'available';
      }

      if (titleiLike) {
        whereQuery.listing.title = {
          [models.Sequelize.Op.iLike]: `%${titleiLike}%`,
        };
      }

      if (priceGte) {
        whereQuery.listingPrice.value = {
          [models.Sequelize.Op.gte]: priceGte,
        };
      }

      if (priceLte) {
        whereQuery.listingPrice.value = {
          [models.Sequelize.Op.lte]: priceLte,
        };
      }

      if (currencyTypeIso) {
        whereQuery.listingPrice.currencyTypeIso = currencyTypeIso;
      }

      if (userId && Array.isArray(userId)) {
        whereQuery.user.id = {
          [models.Sequelize.Op.in]: userId,
        };
      }

      if (categoryRefId && Array.isArray(categoryRefId)) {
        whereQuery.listingCategory.listingCategoryRefId = {
          [models.Sequelize.Op.in]: categoryRefId,
        };
      }

      if (limit && limit <= apiConfig.maxPaginationLimit) {
        paginationQuery.limit = limit;
      }

      if (offset) {
        paginationQuery.offset = offset;
      }
    } catch (error) {
      return this.fail(res, error);
    }

    let listingObjs;

    try {
      listingObjs = await models.Listing.findAndCountAll({
        attributes: {
          include: [...attributes],
        },
        where: whereQuery.listing,
        order: orderQuery,
        ...paginationQuery,
        subQuery: false,
        include: [
          { model: models.User, as: 'user', where: whereQuery.user },
          { model: models.ListingAddress, as: 'listingAddress' },
          {
            model: models.ListingPrice,
            as: 'listingPrice',
            where: whereQuery.listingPrice,
          },
          {
            model: models.ListingStatus,
            as: 'listingStatus',
            where: whereQuery.listingStatus,
          },
          {
            model: models.ListingImage,
            as: 'listingImages',
            include: [
              {
                model: models.File,
                as: 'file',
                include: [{ model: models.FileLink, as: 'fileLinks' }],
              },
            ],
          },
          {
            model: models.ListingCategory,
            as: 'listingCategory',
            include: [
              {
                model: models.ListingCategoryRef,
                as: 'listingCategoryRef',
              },
            ],
            where: whereQuery.listingCategory,
          },
          { model: models.ListingMetadata, as: 'listingMetadata' },
        ],
      });
    } catch (error) {
      return this.fail(res, error);
    }

    const responseData = {
      count: listingObjs.count,
      ...paginationQuery,
      listings: [],
    };

    try {
      if (listingObjs && listingObjs.rows) {
        listingObjs.rows.forEach((listingObj) => {
          const geocodingData = listingObj.listingAddress.googleGeocodingData;

          const addressComponents = googleMapsUtils.getAddressComponents(
            geocodingData
          );

          const approxAddressComponents = googleMapsUtils.getAddressComponents(
            geocodingData,
            true
          );

          const shortDescription = apiUtils.truncateString(
            apiUtils.cleanString(listingObj.description),
            256
          );

          const formattedApproxAddress = googleMapsUtils.getFormattedAddress(
            approxAddressComponents
          );

          const listing = {
            id: listingObj.id,
            title: listingObj.title,
            shortDescription: shortDescription,
            description: null,
            listingType: listingObj.listingType,
            status: listingObj.listingStatus.statusType,
            price: {
              value: listingObj.listingPrice.value,
              currencyTypeIso: listingObj.listingPrice.currencyTypeIso,
            },
            createdBy: {
              id: listingObj.user.id,
              name: listingObj.user.name,
            },
            approximateLocation: {
              formattedAddress: formattedApproxAddress,
              addressComponents: approxAddressComponents,
            },
            preciseLocation: {
              submittedAddress: listingObj.listingAddress.submittedAddress,
              formattedAddress: listingObj.listingAddress.formattedAddress,
              addressComponents: addressComponents,
              geographic: {
                lat:
                  listingObj.listingAddress.googleGeocodingData?.geometry
                    ?.location.lat || null,
                lng:
                  listingObj.listingAddress.googleGeocodingData?.geometry
                    ?.location.lng || null,
              },
              googlePlaceId:
                // eslint-disable-next-line camelcase
                listingObj.listingAddress.googleGeocodingData?.place_id || null,
              note: listingObj.listingAddress.note || null,
            },
            category: {
              ref: {
                id: listingObj.listingCategory.listingCategoryRef.id,
                name: listingObj.listingCategory.listingCategoryRef.name,
              },
            },
            metaData: {
              size: listingObj.listingMetadata.size,
              brandName: listingObj.listingMetadata.brandName,
              condition: listingObj.listingMetadata.condition,
            },
            images: [],
            createdAt: listingObj.createdAt,
            updatedAt: listingObj.updatedAt,
          };

          if (req.user.id !== listingObj.userId) {
            // Remove listing fields if not created \
            // by the authenticated user.
            listing.preciseLocation = null;
          }

          listingObj.listingImages.forEach((listingImageObj) => {
            const image = {
              id: listingImageObj.id,
              orderIndex: listingImageObj.orderIndex || 0,
              file: {
                id: listingImageObj.file.id,
                links: [],
              },
            };

            listingImageObj.file.fileLinks.forEach((fileLinkObj) => {
              image.file.links.push({
                id: fileLinkObj.id,
                fileSize: fileLinkObj.fileSize,
                fileContentType: fileLinkObj.fileContentType,
                url: fileUtils.getFileLinkUrl(fileLinkObj),
                metadata: fileLinkObj.metadata || null,
              });
            });

            listing.images.push(image);
          });

          responseData.listings.push(listing);
        });
      }
    } catch (error) {
      return this.fail(res, error);
    }

    return this.ok(res, responseData);
  }

  /**
   * Update a listing \
   * with params `listingId`.
   */
  async updateListingItem(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    if (req.validated.body?.error) {
      errorResponseObj = errorResponses.validationBodyError;
      errorResponseObj.extra = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const listingObj = await models.Listing.findByPk(
        req.validated.params.value.listingId,
        {
          include: [
            {
              model: models.User,
              as: 'user',
            },
            {
              model: models.ListingAddress,
              as: 'listingAddress',
            },
            {
              model: models.ListingPrice,
              as: 'listingPrice',
            },
            {
              model: models.ListingStatus,
              as: 'listingStatus',
            },
          ],
        }
      );

      if (listingObj) {
        if (listingObj.userId !== req.user?.id) {
          return this.unauthorized(res, null);
        }

        if (listingObj.listingStatus.statusType !== 'available') {
          errorResponseObj = errorResponses.lockedListingError;
          errorResponseObj.extra = {
            listingStatus: listingObj.listingStatus.statusType,
          };

          return this.forbidden(res, errorResponseObj);
        }

        if (
          typeof req.validated.body.value.description !== 'undefined' &&
          req.validated.body.value.description !== listingObj.description
        ) {
          listingObj.description = req.validated.body.value.description;
        }

        if (
          typeof req.validated.body.value.addressNote !== 'undefined' &&
          req.validated.body.value.addressNote !==
            listingObj.listingAddress.addressNote
        ) {
          listingObj.listingAddress.note = req.validated.body.value.addressNote;
        }

        if (
          typeof req.validated.body.value.priceValue !== 'undefined' &&
          req.validated.body.value.priceValue !== listingObj.listingPrice.value
        ) {
          listingObj.listingPrice.value = req.validated.body.value.priceValue;
        }

        await listingObj.listingAddress.save();
        await listingObj.listingPrice.save();
        await listingObj.save();

        const geocodingData = listingObj.listingAddress.googleGeocodingData;

        const addressComponentsObj = googleMapsUtils.getAddressComponents(
          geocodingData
        );

        const approxAddressComponentsObj = googleMapsUtils.getAddressComponents(
          geocodingData,
          true
        );

        const shortDescription = apiUtils.truncateString(
          apiUtils.cleanString(listingObj.description),
          256
        );

        const responseObj = {
          id: listingObj.id,
          title: listingObj.title,
          shortDescription: shortDescription,
          description: listingObj.description,
          listingType: listingObj.listingType,
          price: {
            value: listingObj.listingPrice.value,
            currencyTypeIso: listingObj.listingPrice.currencyTypeIso,
          },
          user: {
            id: listingObj.user.id,
            name: listingObj.user.name,
          },
          approximateLocation: {
            formattedAddress: googleMapsUtils.getFormattedAddress(
              approxAddressComponentsObj
            ),
            addressComponents: approxAddressComponentsObj,
          },
          preciseLocation: {
            submittedAddress: listingObj.listingAddress.submittedAddress,
            formattedAddress: listingObj.listingAddress.formattedAddress,
            addressComponents: addressComponentsObj,
            geographic: {
              lat:
                listingObj.listingAddress.googleGeocodingData?.geometry
                  ?.location.lat || null,
              lng:
                listingObj.listingAddress.googleGeocodingData?.geometry
                  ?.location.lng || null,
            },
            googlePlaceId:
              // eslint-disable-next-line camelcase
              listingObj.listingAddress.googleGeocodingData?.place_id || null,
            note: listingObj.listingAddress.note || null,
          },
          status: listingObj.listingStatus.statusType,
          createdAt: listingObj.createdAt,
          updatedAt: listingObj.updatedAt,
        };

        return this.ok(res, responseObj);
      }

      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Delete a listing \
   * with params `listingId`.
   */
  async deleteListingItem(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const listingObj = await models.Listing.findByPk(
        req.validated.params.value.listingId,
        {
          include: [
            {
              model: models.User,
              as: 'user',
            },
            {
              model: models.ListingStatus,
              as: 'listingStatus',
            },
          ],
        }
      );

      if (listingObj) {
        if (listingObj.userId !== req.user?.id) {
          return this.unauthorized(res, null);
        }

        if (listingObj.listingStatus.statusType !== 'available') {
          errorResponseObj = errorResponses.lockedListingError;
          errorResponseObj.extra = {
            listingStatus: listingObj.listingStatus.statusType,
          };

          return this.forbidden(res, errorResponseObj);
        }

        await listingObj.destroy();

        return this.noContent(res, null);
      }

      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Create a listing enquiry for a listing \
   * with params `listinId`.
   */
  async createListingItemListingEnquiryItem(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    if (req.validated.body?.error) {
      errorResponseObj = errorResponses.validationBodyError;
      errorResponseObj.extra = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const listingObj = await models.Listing.findByPk(
        req.validated.params.value.listingId,
        {
          include: [
            {
              model: models.User,
              as: 'user',
            },
            {
              model: models.ListingStatus,
              as: 'listingStatus',
            },
          ],
        }
      );

      if (listingObj) {
        if (listingObj.listingStatus.statusType !== 'available') {
          errorResponseObj = errorResponses.lockedListingError;
          errorResponseObj.extra = {
            listingStatus: listingObj.listingStatus.statusType,
          };

          return this.forbidden(res, errorResponseObj);
        }

        if (listingObj.listingType !== 'rent') {
          errorResponseObj = errorResponses.notRentableError;

          return this.forbidden(res, errorResponseObj);
        }

        if (listingObj.userId === req.user.id) {
          return this.forbidden(res, null);
        }

        const existingEnquiryObjs = await listingObj.getListingEnquiries({
          where: {
            userId: req.user.id,
            enquiryStatus: 'pending',
          },
        });

        if (existingEnquiryObjs.length > 0) {
          errorResponseObj = errorResponses.previousPendingReviewEnquiryError;
          errorResponseObj.extra = {
            enquiryId: existingEnquiryObjs.map((obj) => obj.id),
          };

          return this.forbidden(res, errorResponseObj);
        }

        const enquiryObj = await models.ListingEnquiry.create({
          enquiryStatus: 'pending',
          note: req.validated.body.value?.note || null,
          userId: req.user.id,
          listingId: listingObj.id,
        });

        // sequelize bruh.
        const enquiryObjUser = await enquiryObj.getUser();

        const responseObj = {
          id: enquiryObj.id,
          status: enquiryObj.enquiryStatus,
          note: enquiryObj.note || null,
          user: {
            id: enquiryObjUser.id,
            name: enquiryObjUser.name,
          },
          listing: {
            id: listingObj.id,
            title: listingObj.title,
          },
          rental: null,
          createdAt: enquiryObj.createdAt,
          updatedAt: enquiryObj.updatedAt,
        };

        return this.ok(res, responseObj);
      }
      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Retrieve a list of listing enquiries for a listing \
   * with params `listingId`.
   */
  async retrieveListingItemListingEnquiryList(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    if (req.validated.query?.error) {
      errorResponseObj = errorResponses.validationQueryError;
      errorResponseObj.extra = req.validated.query.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const listingObj = await models.Listing.findByPk(
        req.validated.params.value.listingId,
        {
          include: [
            {
              model: models.User,
              as: 'user',
            },
            {
              model: models.ListingStatus,
              as: 'listingStatus',
            },
          ],
        }
      );

      if (listingObj.userId !== req.user.id) {
        return this.unauthorized(res, null);
      }

      const orderSqlQuery = [];

      if (typeof req.validated.query.value.orderBy !== 'undefined') {
        let queries = [];

        if (Array.isArray(req.validated.query.value.orderBy)) {
          queries = [...req.validated.query.value.orderBy];
        } else {
          queries = [req.validated.query.value.orderBy];
        }

        queries.forEach((queryVal) => {
          switch (queryVal) {
            case 'createdAt':
              orderSqlQuery.push(['createdAt', 'ASC']);
              break;
            case '-createdAt':
              orderSqlQuery.push(['createdAt', 'DESC']);
              break;
            case 'updatedAt':
              orderSqlQuery.push(['updatedAt', 'ASC']);
              break;
            case '-updatedAt':
              orderSqlQuery.push(['updatedAt', 'DESC']);
              break;
            default:
              break;
          }
        });
      } else {
        // Order by `createdAt` by default.
        orderSqlQuery.push(['createdAt', 'DESC']);
      }

      const whereSqlQuery = {};

      if (typeof req.validated.query.value.filterBy !== 'undefined') {
        let queries = [];

        if (Array.isArray(req.validated.query.value.filterBy)) {
          queries = [...req.validated.query.value.filterBy];
        } else {
          queries = [req.validated.query.value.filterBy];
        }

        queries.forEach((queryVal) => {
          switch (queryVal) {
            case 'IsPending':
              whereSqlQuery.enquiryStatus = 'pending';
              break;
            case 'IsAccepted':
              whereSqlQuery.enquiryStatus = 'accepted';
              break;
            case 'isRejected':
              whereSqlQuery.enquiryStatus = 'rejected';
              break;
            case 'isCompleted':
              whereSqlQuery.enquiryStatus = 'completed';
              break;
            default:
              break;
          }
        });
      }

      const paginationSqlQuery = {
        limit: apiConfig.defaultPaginationLimit,
        offset: 0,
      };

      if (typeof req.validated.query.value.limit !== 'undefined') {
        if (req.validated.query.value.limit <= apiConfig.maxPaginationLimit)
          paginationSqlQuery.limit = req.validated.query.value.limit;
      }

      if (typeof req.validated.query.value.offset !== 'undefined') {
        paginationSqlQuery.offset = req.validated.query.value.offset;
      }

      const enquiryObjs = await models.ListingEnquiry.findAndCountAll({
        where: {
          ...whereSqlQuery,
          listingId: listingObj.id,
        },
        order: [...orderSqlQuery],
        ...paginationSqlQuery,
        include: [
          {
            model: models.User,
            as: 'user',
          },
          {
            model: models.Listing,
            as: 'listing',
          },
          {
            model: models.ListingRental,
            as: 'listingRental',
          },
        ],
      });

      const responseObj = {
        count: enquiryObjs.count,
        ...paginationSqlQuery,
        listings: [],
      };

      enquiryObjs.rows.forEach((row) => {
        const obj = {
          id: row.id,
          status: row.enquiryStatus,
          note: row.note || null,
          user: {
            id: row.user.id,
            name: row.user.name,
          },
          listing: {
            id: row.listing.id,
            title: row.listing.title,
          },
          rental: null,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        };

        if (row.listingRental) {
          obj.rental = {
            id: row.listingRental.id,
            status: row.listingRental.rentalStatus,
          };
        }

        responseObj.listings.push(obj);
      });

      return this.ok(res, responseObj);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Create a listing purchase for a listing \
   * with params `listingId`.
   */
  async createListingItemListingPurchaseItem(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const listingObj = await models.Listing.findByPk(
        req.validated.params.value.listingId,
        {
          include: [
            {
              model: models.User,
              as: 'user',
            },
            {
              model: models.ListingStatus,
              as: 'listingStatus',
            },
          ],
        }
      );

      if (listingObj) {
        if (listingObj.listingStatus.statusType !== 'available') {
          errorResponseObj = errorResponses.lockedListingError;
          errorResponseObj.extra = {
            listingStatus: listingObj.listingStatus.statusType,
          };

          return this.forbidden(res, errorResponseObj);
        }

        if (listingObj.listingType !== 'sell') {
          errorResponseObj = errorResponses.notPurchasableError;

          return this.forbidden(res, errorResponseObj);
        }

        if (listingObj.userId === req.user.id) {
          return this.forbidden(res, null);
        }

        const purchaseObj = await models.sequelize.transaction(async (t) => {
          listingObj.listingStatus.statusType = 'purchased';

          await listingObj.listingStatus.save({ transaction: t });

          return models.ListingPurchase.create(
            {
              purchaseStatus: 'pending',
              userId: req.user.id,
              listingId: listingObj.id,
            },
            { transaction: t }
          );
        });

        // sequelize bruh.
        const purchaseObjUser = await purchaseObj.getUser();

        const responseObj = {
          id: purchaseObj.id,
          status: purchaseObj.purchaseStatus,
          user: {
            id: purchaseObjUser.id,
            name: purchaseObjUser.name,
          },
          listing: {
            id: listingObj.id,
            title: listingObj.title,
          },
          createdAt: purchaseObj.createdAt,
          updatedAt: purchaseObj.updatedAt,
        };

        return this.ok(res, responseObj);
      }
      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Retrieve a list of listing purchases for a listing \
   * with params `listingId`.
   */
  async retrieveListingItemListingPurchaseList(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    if (req.validated.query?.error) {
      errorResponseObj = errorResponses.validationQueryError;
      errorResponseObj.extra = req.validated.query.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const listingObj = await models.Listing.findByPk(
        req.validated.params.value.listingId,
        {
          include: [
            {
              model: models.User,
              as: 'user',
            },
            {
              model: models.ListingStatus,
              as: 'listingStatus',
            },
          ],
        }
      );

      if (listingObj.userId !== req.user.id) {
        return this.unauthorized(res, null);
      }

      const orderSqlQuery = [];

      if (typeof req.validated.query.value.orderBy !== 'undefined') {
        let queries = [];

        if (Array.isArray(req.validated.query.value.orderBy)) {
          queries = [...req.validated.query.value.orderBy];
        } else {
          queries = [req.validated.query.value.orderBy];
        }

        queries.forEach((queryVal) => {
          switch (queryVal) {
            case 'createdAt':
              orderSqlQuery.push(['createdAt', 'ASC']);
              break;
            case '-createdAt':
              orderSqlQuery.push(['createdAt', 'DESC']);
              break;
            case 'updatedAt':
              orderSqlQuery.push(['updatedAt', 'ASC']);
              break;
            case '-updatedAt':
              orderSqlQuery.push(['updatedAt', 'DESC']);
              break;
            default:
              break;
          }
        });
      } else {
        // Order by `createdAt` by default.
        orderSqlQuery.push(['createdAt', 'DESC']);
      }

      const whereSqlQuery = {};

      if (typeof req.validated.query.value.filterBy !== 'undefined') {
        let queries = [];

        if (Array.isArray(req.validated.query.value.filterBy)) {
          queries = [...req.validated.query.value.filterBy];
        } else {
          queries = [req.validated.query.value.filterBy];
        }

        queries.forEach((queryVal) => {
          switch (queryVal) {
            case 'IsPending':
              whereSqlQuery.purchaseStatus = 'pending';
              break;
            case 'isCancelled':
              whereSqlQuery.purchaseStatus = 'cancelled';
              break;
            case 'isPicked':
              whereSqlQuery.purchaseStatus = 'picked';
              break;
            default:
              break;
          }
        });
      }

      const paginationSqlQuery = {
        limit: apiConfig.defaultPaginationLimit,
        offset: 0,
      };

      if (typeof req.validated.query.value.limit !== 'undefined') {
        if (req.validated.query.value.limit <= apiConfig.maxPaginationLimit)
          paginationSqlQuery.limit = req.validated.query.value.limit;
      }

      if (typeof req.validated.query.value.offset !== 'undefined') {
        paginationSqlQuery.offset = req.validated.query.value.offset;
      }

      const purchaseObjs = await models.ListingPurchase.findAndCountAll({
        where: {
          ...whereSqlQuery,
          listingId: listingObj.id,
        },
        order: [...orderSqlQuery],
        ...paginationSqlQuery,
        include: [
          {
            model: models.User,
            as: 'user',
          },
          {
            model: models.Listing,
            as: 'listing',
          },
        ],
      });

      const responseObj = {
        count: purchaseObjs.count,
        ...paginationSqlQuery,
        purchases: [],
      };

      purchaseObjs.rows.forEach((row) => {
        const obj = {
          id: row.id,
          status: row.purchaseStatus,
          listing: {
            id: row.listing.id,
            title: row.listing.title,
          },
          purchaser: {
            id: row.user.id,
            name: row.user.name,
          },
          pickedAt: row.listing.pickedAt || null,
          cancelledAt: row.listing.cancelledAt || null,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        };

        responseObj.purchases.push(obj);
      });

      return this.ok(res, responseObj);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Get all images attached to the listing \
   * with params `listingId`.
   */
  async getImages(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    const { listingId } = req.validated.params.value;

    let listingImageObjs = [];

    try {
      listingImageObjs = await models.ListingImage.findAndCountAll({
        where: {
          listingId,
        },
        orderSqlQuery: ['orderIndex', 'ASC'],
        include: [
          {
            model: models.File,
            as: 'file',
            where: {
              purpose: 'listing_image',
            },
            include: [
              {
                model: models.FileLink,
                as: 'fileLinks',
              },
            ],
          },
        ],
      });
    } catch (error) {
      return this.fail(res, error);
    }

    const responseObj = {
      count: listingImageObjs.count,
      images: [],
    };

    listingImageObjs.rows.forEach((listingImageObj) => {
      const imageItem = {
        id: listingImageObj.id,
        orderIndex: listingImageObj.orderIndex || 0,
        file: {
          id: listingImageObj.file.id,
          purpose: listingImageObj.file.purpose,
          links: [],
        },
        createdAt: listingImageObj.createdAt,
        updatedAt: listingImageObj.updatedAt,
      };

      if (listingImageObj.file.fileLinks.length > 0) {
        listingImageObj.file.fileLinks.forEach((fileLinkObj) => {
          imageItem.file.links.push({
            id: fileLinkObj.id,
            fileName: fileLinkObj.fileName,
            fileSize: fileLinkObj.fileSize,
            fileContentType: fileLinkObj.fileContentType,
            url: fileUtils.getFileLinkUrl(fileLinkObj),
            metadata: fileLinkObj.metadata || {},
            uploadedAt: fileLinkObj.uploadedAt,
            expiresAt: fileLinkObj.expiresAt,
          });
        });
      }

      responseObj.images.push(imageItem);
    });

    return this.ok(res, responseObj);
  }

  /**
   * Create an image (file) to a listing\
   * with params `listingId`.
   */
  async createImage(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    if (req.validated.body?.error) {
      errorResponseObj = errorResponses.validationBodyError;
      errorResponseObj.extra = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    const { listingId } = req.validated.params.value;
    const { fileId, orderIndex } = req.validated.body.value;

    let listingObj;
    let fileObj;

    try {
      listingObj = await models.Listing.findByPk(listingId, {
        include: [
          {
            model: models.ListingImage,
            as: 'listingImages',
          },
        ],
      });
      fileObj = await models.File.findByPk(fileId);
    } catch (error) {
      return this.fail(res, error);
    }

    if (!listingObj) {
      errorResponseObj = errorResponses.listingNotFoundError;
      return this.notFound(res, errorResponseObj);
    }

    if (!fileObj) {
      errorResponseObj = errorResponses.fileNotFoundError;
      return this.notFound(res, errorResponseObj);
    }

    if (listingObj.userId !== req.user.id || fileObj.userId !== req.user.id) {
      return this.unauthorized(res);
    }

    if (fileObj.purpose !== 'listing_image') {
      errorResponseObj = errorResponses.invalidFilePurposeError;
      return this.badRequest(res, errorResponseObj);
    }

    let listingImageObj;

    try {
      await models.sequelize.transaction(async (transaction) => {
        listingImageObj = await models.ListingImage.create(
          {
            listingId,
            fileId,
            orderIndex,
          },
          {
            transaction,
          }
        );

        listingImageObj.file = await listingImageObj.getFile({
          include: [
            {
              model: models.FileLink,
              as: 'fileLinks',
            },
          ],
          transaction,
        });
      });
    } catch (error) {
      return this.fail(res, error);
    }

    const responseObj = {
      id: listingImageObj.id,
      orderIndex: listingImageObj.orderIndex || 0,
      file: {
        id: listingImageObj.file.id,
        purpose: listingImageObj.file.purpose,
        links: [],
      },
      createdAt: listingImageObj.createdAt,
      updatedAt: listingImageObj.updatedAt,
    };

    if (listingImageObj.file.fileLinks.length > 0) {
      listingImageObj.file.fileLinks.forEach((fileLinkObj) => {
        responseObj.file.links.push({
          id: fileLinkObj.id,
          fileName: fileLinkObj.fileName,
          fileSize: fileLinkObj.fileSize,
          fileContentType: fileLinkObj.fileContentType,
          url: fileUtils.getFileLinkUrl(fileLinkObj),
          metadata: fileLinkObj.metadata || {},
          uploadedAt: fileLinkObj.uploadedAt,
          expiresAt: fileLinkObj.expiresAt,
        });
      });
    }

    return this.ok(res, responseObj);
  }

  /**
   * Get an image (file) of a listing \
   * with params `listingId`, `listingImageId`.
   */
  async getImage(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    const { listingId, listingImageId } = req.validated.params.value;

    let listingImageObj;

    try {
      listingImageObj = await models.ListingImage.findByPk(listingImageId, {
        include: [
          {
            model: models.Listing,
            as: 'listing',
            where: {
              id: listingId,
            },
          },
          {
            model: models.File,
            as: 'file',
            include: [
              {
                model: models.FileLink,
                as: 'fileLinks',
              },
            ],
          },
        ],
      });
    } catch (error) {
      return this.fail(res, error);
    }

    if (!listingImageObj) {
      return this.notFound(res);
    }

    const responseObj = {
      id: listingImageObj.id,
      orderIndex: listingImageObj.orderIndex || 0,
      file: {
        id: listingImageObj.file.id,
        purpose: listingImageObj.file.purpose,
        links: [],
      },
      createdAt: listingImageObj.createdAt,
      updatedAt: listingImageObj.updatedAt,
    };

    if (listingImageObj.file.fileLinks.length > 0) {
      listingImageObj.file.fileLinks.forEach((fileLinkObj) => {
        responseObj.file.links.push({
          id: fileLinkObj.id,
          fileName: fileLinkObj.fileName,
          fileSize: fileLinkObj.fileSize,
          fileContentType: fileLinkObj.fileContentType,
          url: fileUtils.getFileLinkUrl(fileLinkObj),
          metadata: fileLinkObj.metadata || {},
          uploadedAt: fileLinkObj.uploadedAt,
          expiresAt: fileLinkObj.expiresAt,
        });
      });
    }

    return this.ok(res, responseObj);
  }

  /**
   * Update an image (file) of a listing \
   * with params `listingId`, `listingImageId`.
   */
  async updateImage(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    if (req.validated.body?.error) {
      errorResponseObj = errorResponses.validationBodyError;
      errorResponseObj.extra = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    const { listingId, listingImageId } = req.validated.params.value;
    const { orderIndex } = req.validated.body.value;

    let listingImageObj;

    try {
      listingImageObj = await models.ListingImage.findByPk(listingImageId, {
        include: [
          {
            model: models.Listing,
            as: 'listing',
            where: {
              id: listingId,
            },
          },
          {
            model: models.File,
            as: 'file',
            include: [
              {
                model: models.FileLink,
                as: 'fileLinks',
              },
            ],
          },
        ],
      });
    } catch (error) {
      return this.fail(res, error);
    }

    if (!listingImageObj) {
      return this.notFound(res);
    }

    if (listingImageObj.listing.userId !== req.user.id) {
      return this.unauthorized(res);
    }

    try {
      listingImageObj.orderIndex = orderIndex;

      await listingImageObj.save();
    } catch (error) {
      return this.fail(res, error);
    }

    const responseObj = {
      id: listingImageObj.id,
      orderIndex: listingImageObj.orderIndex || 0,
      file: {
        id: listingImageObj.file.id,
        purpose: listingImageObj.file.purpose,
        links: [],
      },
      createdAt: listingImageObj.createdAt,
      updatedAt: listingImageObj.updatedAt,
    };

    if (listingImageObj.file.fileLinks.length > 0) {
      listingImageObj.file.fileLinks.forEach((fileLinkObj) => {
        responseObj.file.links.push({
          id: fileLinkObj.id,
          fileName: fileLinkObj.fileName,
          fileSize: fileLinkObj.fileSize,
          fileContentType: fileLinkObj.fileContentType,
          url: fileUtils.getFileLinkUrl(fileLinkObj),
          metadata: fileLinkObj.metadata || {},
          uploadedAt: fileLinkObj.uploadedAt,
          expiresAt: fileLinkObj.expiresAt,
        });
      });
    }

    return this.ok(res, responseObj);
  }

  /**
   * Delete an image (file) from a listing \
   * with params `listingId`, `listingImageId`.
   */
  async deleteImage(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    const { listingId, listingImageId } = req.validated.params.value;

    let listingImageObj;

    try {
      listingImageObj = await models.ListingImage.findByPk(listingImageId, {
        include: [
          {
            model: models.Listing,
            as: 'listing',
            where: {
              id: listingId,
            },
          },
        ],
      });
    } catch (error) {
      return this.fail(res, error);
    }

    if (!listingImageObj) {
      return this.notFound(res);
    }

    if (listingImageObj.listing.userId !== req.user.id) {
      return this.unauthorized(res);
    }

    try {
      await listingImageObj.destroy();
    } catch (error) {
      return this.fail(res, error);
    }

    return this.noContent(res);
  }
}

module.exports = new ListingController();
