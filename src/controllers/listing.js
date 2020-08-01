const BaseController = require('./base');
const models = require('../models');
const googleMapsHelper = require('../helpers/google-maps');
const googleMapsUtils = require('../utils/google-maps');
const apiUtils = require('../utils/api');
const apiConfig = require('../configs/api');

class ListingController extends BaseController {
  /**
   * Create a listing.
   */
  async createListingItem(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.body?.error) {
      errorResponseObj.validation.body = req.validated.body.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    const geocodingData = await googleMapsHelper.getGeocodingData(
      req.validated.body.value.address
    );

    if (geocodingData.length === 0) {
      return this.conflict(res, 'Failed to proccess listing address');
    }

    try {
      const result = await models.sequelize.transaction(async (t) => {
        const listingObj = await models.Listing.create(
          {
            title: req.validated.body.value.title,
            description: req.validated.body.value.description,
            listingType: req.validated.body.value.listingType,
            userId: req.user.id,
          },
          {
            transaction: t,
          }
        );

        const listingPriceObj = await models.ListingPrice.create(
          {
            value: req.validated.body.value.priceValue,
            currencyTypeIso: req.validated.body.value.currencyTypeIso,
            listingId: listingObj.id,
          },
          {
            transaction: t,
          }
        );

        const listingAddressObj = await models.ListingAddress.create(
          {
            note: req.validated.body.value.addressNote,
            submittedAddress: req.validated.body.value.address,
            formattedAddress: geocodingData[0].formatted_address,
            googleGeocodingData: geocodingData[0],
            listingId: listingObj.id,
          },
          {
            transaction: t,
          }
        );

        const listingStatusObj = await models.ListingStatus.create(
          {
            statusType: 'available',
            listingId: listingObj.id,
          },
          {
            transaction: t,
          }
        );

        return {
          listing: listingObj,
          listingPrice: listingPriceObj,
          listingAddress: listingAddressObj,
          listingStatus: listingStatusObj,
        };
      });

      result.user = await result.listing.getUser();

      const addressComponentsObj = googleMapsUtils.getAddressComponents(
        geocodingData[0]
      );

      const approxAddressComponentsObj = googleMapsUtils.getAddressComponents(
        geocodingData[0],
        true
      );

      const shortDescription = apiUtils.truncateString(
        apiUtils.cleanString(result.listing.description),
        256
      );

      const responsObj = {
        id: result.listing.id,
        title: result.listing.title,
        shortDescription: shortDescription,
        description: result.listing.description,
        listingType: result.listing.listingType,
        price: {
          value: result.listingPrice.value,
          currencyTypeIso: result.listingPrice.currencyTypeIso,
        },
        user: {
          id: result.user.id,
          name: result.user.name,
        },
        approximateLocation: {
          formattedAddress: googleMapsUtils.getFormattedAddress(
            approxAddressComponentsObj
          ),
          addressComponents: approxAddressComponentsObj,
        },
        preciseLocation: {
          submittedAddress: result.listingAddress.submittedAddress,
          formattedAddress: result.listingAddress.formattedAddress,
          addressComponents: addressComponentsObj,
          geographic: {
            lat:
              result.listingAddress.googleGeocodingData?.geometry?.location
                .lat || null,
            lng:
              result.listingAddress.googleGeocodingData?.geometry?.location
                .lng || null,
          },
          googlePlaceId:
            // eslint-disable-next-line camelcase
            result.listingAddress.googleGeocodingData?.place_id || null,
          note: result.listingAddress.note || null,
        },
        status: result.listingStatus.statusType,
        createdAt: result.listing.createdAt,
        updatedAt: result.listing.updatedAt,
      };

      return this.created(res, responsObj);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Retrieve a listing \
   * with params `listingId`.
   */
  async retrieveListingItem(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.params?.error) {
      errorResponseObj.validation.params = req.validated.params.error;

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
   * TODO: Add lat lng search LMAO!!!!
   */
  async retrieveListingList(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.query?.error) {
      errorResponseObj.validation.query = req.validated.query.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
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
            case 'priceValue':
              orderSqlQuery.push(['listingPrice', 'value', 'ASC']);
              break;
            case '-priceValue':
              orderSqlQuery.push(['listingPrice', 'value', 'DESC']);
              break;
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

      // Only show available listings by default.
      whereSqlQuery['$listingStatus.status_type$'] = 'available';

      if (typeof req.validated.query.value.filterBy !== 'undefined') {
        let queries = [];

        if (Array.isArray(req.validated.query.value.filterBy)) {
          queries = [...req.validated.query.value.filterBy];
        } else {
          queries = [req.validated.query.value.filterBy];
        }

        queries.forEach((queryVal) => {
          switch (queryVal) {
            case 'isRentable':
              whereSqlQuery.listingType = 'rent';
              break;
            case 'isPurchasable':
              whereSqlQuery.listingType = 'sell';
              break;
            case 'isAvailable':
              whereSqlQuery['$listingStatus.status_type$'] = 'available';
              break;
            case '-isAvailable':
              whereSqlQuery['$listingStatus.status_type$'] = {
                [models.Sequelize.Op.not]: 'available',
              };
              break;
            default:
              break;
          }
        });
      }

      if (typeof req.validated.query.value.titleiLike !== 'undefined') {
        whereSqlQuery.title = {
          [models.Sequelize.Op
            .iLike]: `%${req.validated.query.value.titleiLike}%`,
        };
      }

      if (typeof req.validated.query.value.priceGte !== 'undefined') {
        whereSqlQuery['$listingPrice.value$'] = {
          [models.Sequelize.Op.gte]: req.validated.query.value.priceGte,
        };
      }

      if (typeof req.validated.query.value.priceLte !== 'undefined') {
        whereSqlQuery['$listingPrice.value$'] = {
          [models.Sequelize.Op.lte]: req.validated.query.value.priceLte,
        };
      }

      if (typeof req.validated.query.value.currencyTypeIso !== 'undefined') {
        whereSqlQuery['$listingPrice.currency_type_iso$'] =
          req.validated.query.value.currencyTypeIso;
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

      const listingObjs = await models.Listing.findAndCountAll({
        where: {
          ...whereSqlQuery,
        },
        order: [...orderSqlQuery],
        ...paginationSqlQuery,
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
      });

      const responseObj = {
        count: listingObjs.count,
        ...paginationSqlQuery,
        listings: [],
      };

      listingObjs.rows.forEach((element) => {
        const geocodingData = element.listingAddress.googleGeocodingData;

        const approxAddressComponentsObj = googleMapsUtils.getAddressComponents(
          geocodingData,
          true
        );

        const shortDescription = apiUtils.truncateString(
          apiUtils.cleanString(element.description),
          256
        );

        responseObj.listings.push({
          id: element.id,
          title: element.title,
          shortDescription: shortDescription,
          description: null,
          listingType: element.listingType,
          price: {
            value: element.listingPrice.value,
            currencyTypeIso: element.listingPrice.currencyTypeIso,
          },
          user: {
            id: element.user.id,
            name: element.user.name,
          },
          approximateLocation: {
            formattedAddress: googleMapsUtils.getFormattedAddress(
              approxAddressComponentsObj
            ),
            addressComponents: approxAddressComponentsObj,
          },
          preciseLocation: null,
          status: element.listingStatus.statusType,
          createdAt: element.createdAt,
          updatedAt: element.updatedAt,
        });
      });

      return this.ok(res, responseObj);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Update a listing \
   * with params `listingId`.
   */
  async updateListingItem(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.params?.error) {
      errorResponseObj.validation.params = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    if (req.validated.body?.error) {
      errorResponseObj.validation.body = req.validated.body.error;

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
          return this.forbidden(
            res,
            `The listing is locked (status: ${listingObj.listingStatus.statusType})`
          );
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
    const errorResponseObj = { validation: {} };

    if (req.validated.params?.error) {
      errorResponseObj.validation.params = req.validated.params.error;

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
          return this.forbidden(
            res,
            `The listing is locked (status: ${listingObj.listingStatus.statusType})`
          );
        }

        await listingObj.destroy();

        return this.noContent(res, null);
      }

      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }
}

module.exports = new ListingController();
