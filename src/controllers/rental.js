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
          pickedAt: rentalObj?.pickedAt || null,
          returnedAt: rentalObj?.returnedAt || null,
          cancelledAt: rentalObj?.cancelledAt || null,
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

  /**
   * Verify pickup (POST) a listing rental \
   * with params `rentalId`.
   * TODO: Add stripe stuff here?
   * TODO: Fix response returning object for a dt;
   */
  async verifyPickupListingRentalItem(req, res) {
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
        // Only the listing enquiry creator can verify.
        if (req.user.id !== rentalObj.listingEnquiry.listing.userId) {
          return this.unauthorized(res, null);
        }

        // Only pending rentals can be picked.
        if (rentalObj.rentalStatus !== 'pending') {
          return this.forbidden(
            res,
            `The listing rental is locked (status: ${rentalObj.rentalStatus})`
          );
        }

        if (rentalObj.pickVerifyCode !== req.validated.body.value.code) {
          return this.unprocessableEntity(res, 'Invalid verification code.');
        }

        // Set rental status.
        rentalObj.rentalStatus = 'picked';
        rentalObj.pickedAt = models.sequelize.literal('CURRENT_TIMESTAMP');

        await rentalObj.save();

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
          pickedAt: rentalObj?.pickedAt || null,
          returnedAt: rentalObj?.returnedAt || null,
          cancelledAt: rentalObj?.cancelledAt || null,
          createdAt: rentalObj.createdAt,
          updatedAt: rentalObj.updatedAt,
        };

        return this.ok(res, responseObj);
      }

      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Verify return (POST) a listing rental \
   * with params `rentalId`.
   * TODO: Add stripe stuff here?
   * TODO: Fix response returning object for a dt;
   */
  async verifyReturnListingRentalItem(req, res) {
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
                  include: [
                    {
                      model: models.ListingStatus,
                      as: 'listingStatus',
                    },
                  ],
                },
              ],
            },
          ],
        }
      );

      if (rentalObj) {
        // Only the listing creator can verify.
        if (req.user.id !== rentalObj.listingEnquiry.listing.userId) {
          return this.unauthorized(res, null);
        }

        // Only picked rentals can be returned.
        if (rentalObj.rentalStatus !== 'picked') {
          return this.forbidden(
            res,
            `The listing rental is locked (status: ${rentalObj.rentalStatus})`
          );
        }

        if (rentalObj.returnVerifyCode !== req.validated.body.value.code) {
          return this.unprocessableEntity(res, 'Invalid verification code.');
        }

        await models.sequelize.transaction(async (t) => {
          // Revert listing status as available.
          rentalObj.listingEnquiry.listing.listingStatus.statusType =
            'available';

          await rentalObj.listingEnquiry.listing.listingStatus.save({
            transaction: t,
          });

          // Set enquiry as completed.
          rentalObj.listingEnquiry.enquiryStatus = 'completed';

          await rentalObj.listingEnquiry.save({ transaction: t });

          // Set rental as returned.
          rentalObj.rentalStatus = 'returned';
          rentalObj.returnedAt = models.sequelize.literal('CURRENT_TIMESTAMP');

          await rentalObj.save({ transaction: t });
        });

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
          pickedAt: rentalObj?.pickedAt || null,
          returnedAt: rentalObj?.returnedAt || null,
          cancelledAt: rentalObj?.cancelledAt || null,
          createdAt: rentalObj.createdAt,
          updatedAt: rentalObj.updatedAt,
        };

        return this.ok(res, responseObj);
      }

      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }
}

module.exports = new RentalController();
