const BaseController = require('./base');
const models = require('../models');
const googleMapsHelper = require('../helpers/google-maps');
const googleMapsUtils = require('../utils/google-maps');
const apiUtils = require('../utils/api');

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

        listingObj.save();

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
