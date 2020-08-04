const BaseController = require('./base');
const models = require('../models');

class RentalController extends BaseController {
  /**
   * Retrieve a listing rental \
   * with params `rentalId`.
   */
  async retrieveListingRentalItem(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.params?.error) {
      errorResponseObj.validation.params = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const rentalObj = await models.ListingRental.findByPk(
        req.validated.params.value.rentalId,
        {
          include: [
            {
              model: models.ListingEnquiry,
              as: 'listingEnquiry',
              include: [
                {
                  model: models.Listing,
                  as: 'listing',
                },
              ],
            },
          ],
        }
      );

      if (rentalObj) {
        if (
          ![
            rentalObj.listingEnquiry.userId,
            rentalObj.listingEnquiry.listing.userId,
          ].some((userId) => req.user.id === userId)
        ) {
          return this.unauthorized(res, null);
        }

        const responseObj = {
          id: rentalObj.id,
          status: rentalObj.rentalStatus,
          enquiry: {
            id: rentalObj.listingEnquiry.id,
            status: rentalObj.listingEnquiry.enquiryStatus,
          },
          verification: {
            pickupCode: rentalObj.pickVerifyCode,
            returnCode: rentalObj.returnVerifyCode,
          },
          createdAt: rentalObj.createdAt,
          updatedAt: rentalObj.updatedAt,
        };

        switch (req.user.id) {
          case rentalObj.listingEnquiry.userId:
            responseObj.verification.returnCode = null;
            break;

          case rentalObj.listingEnquiry.listing.userId:
            responseObj.verification.pickupCode = null;
            break;

          default:
            // Shouldn't reach here.
            responseObj.verification = null;
            break;
        }

        return this.ok(res, responseObj);
      }

      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }
}

module.exports = new RentalController();
