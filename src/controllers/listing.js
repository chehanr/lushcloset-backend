const BaseController = require('./base');
const models = require('../models');
const googleMapsHelper = require('../helpers/google-maps');

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

        return {
          listing: listingObj,
          listingPrice: listingPriceObj,
          listingAddress: listingAddressObj,
        };
      });

      const responsObj = {
        title: result.listing.title,
        description: result.listing.description,
        listingType: result.listing.listingType,
        priceValue: result.listingPrice.value,
        currencyTypeIso: result.listingPrice.currencyTypeIso,
        submittedAddress: result.listingAddress.submittedAddress,
        formattedAddress: result.listingAddress.formattedAddress,
        addressNote: result.listingAddress.note,
      };

      return this.created(res, responsObj);
    } catch (error) {
      return this.fail(res, error);
    }
  }
}

module.exports = new ListingController();
