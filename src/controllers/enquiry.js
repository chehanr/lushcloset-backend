const BaseController = require('./base');
const models = require('../models');
const { errorResponses } = require('../constants/errors');

class EnquiryController extends BaseController {
  /**
   * Retrieve a listing enquiry \
   * with params `enquiryId`.
   */
  async retrieveListingEnquiryItem(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const enquiryObj = await models.ListingEnquiry.findByPk(
        req.validated.params.value.enquiryId,
        {
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
        }
      );

      if (enquiryObj) {
        if (
          ![enquiryObj.userId, enquiryObj.listing.userId].some(
            (userId) => req.user.id === userId
          )
        ) {
          return this.unauthorized(res, null);
        }

        const responseObj = {
          id: enquiryObj.id,
          status: enquiryObj.enquiryStatus,
          user: {
            id: enquiryObj.user.id,
            name: enquiryObj.user.name,
          },
          listing: {
            id: enquiryObj.listing.id,
            title: enquiryObj.listing.title,
          },
          rental: null,
          createdAt: enquiryObj.createdAt,
          updatedAt: enquiryObj.updatedAt,
        };

        if (enquiryObj.listingRental) {
          responseObj.rental = {
            id: enquiryObj.listingRental.id,
            status: enquiryObj.listingRental.rentalStatus,
          };
        }

        return this.ok(res, responseObj);
      }
      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Update a listing enquiry \
   * with params `enquiryId`.
   */
  async updateListingEnquiryItem(req, res) {
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
      const enquiryObj = await models.ListingEnquiry.findByPk(
        req.validated.params.value.enquiryId,
        {
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
        }
      );

      if (enquiryObj) {
        if (enquiryObj.userId !== req.user.id) {
          return this.unauthorized(res, null);
        }

        if (
          ['accepted', 'rejected', 'completed'].some(
            (status) => enquiryObj.enquiryStatus === status
          )
        ) {
          errorResponseObj = errorResponses.lockedEnquiryError;
          errorResponseObj.extra = { enquiryStatus: enquiryObj.enquiryStatus };

          return this.forbidden(res, errorResponseObj);
        }

        if (
          typeof req.validated.body.value.note !== 'undefined' &&
          req.validated.body.value.note !== enquiryObj.note
        ) {
          enquiryObj.note = req.validated.body.value.note;
        }

        await enquiryObj.save();

        const responseObj = {
          id: enquiryObj.id,
          status: enquiryObj.enquiryStatus,
          note: enquiryObj.note || null,
          user: {
            id: enquiryObj.user.id,
            name: enquiryObj.user.name,
          },
          listing: {
            id: enquiryObj.listing.id,
            title: enquiryObj.listing.title,
          },
          rental: null,
          createdAt: enquiryObj.createdAt,
          updatedAt: enquiryObj.updatedAt,
        };

        if (enquiryObj.listingRental) {
          responseObj.rental = {
            id: enquiryObj.listingRental.id,
            status: enquiryObj.listingRental.rentalStatus,
          };
        }

        return this.ok(res, responseObj);
      }

      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Delete a listing enquiry \
   * with params `enquiryId`.
   */
  async deleteListingEnquiryItem(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const enquiryObj = await models.ListingEnquiry.findByPk(
        req.validated.params.value.enquiryId,
        {
          include: [
            {
              model: models.User,
              as: 'user',
            },
          ],
        }
      );

      if (enquiryObj) {
        if (enquiryObj.userId !== req.user.id) {
          return this.unauthorized(res, null);
        }

        if (
          ['accepted', 'rejected', 'completed'].some(
            (status) => enquiryObj.enquiryStatus === status
          )
        ) {
          errorResponseObj = errorResponses.lockedEnquiryError;
          errorResponseObj.extra = { enquiryStatus: enquiryObj.enquiryStatus };

          return this.forbidden(res, errorResponseObj);
        }

        await enquiryObj.destroy();

        return this.noContent(res, null);
      }

      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Accept (POST) a listing enquiry \
   * with params `enquiryId`.
   */
  async acceptListingEnquiryItem(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const enquiryObj = await models.ListingEnquiry.findByPk(
        req.validated.params.value.enquiryId,
        {
          include: [
            {
              model: models.User,
              as: 'user',
            },
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
        }
      );

      if (enquiryObj) {
        if (enquiryObj.listing.userId !== req.user.id) {
          return this.unauthorized(res, null);
        }

        if (
          ['accepted', 'rejected', 'completed'].some(
            (status) => enquiryObj.enquiryStatus === status
          )
        ) {
          errorResponseObj = errorResponses.lockedEnquiryError;
          errorResponseObj.extra = { enquiryStatus: enquiryObj.enquiryStatus };

          return this.forbidden(res, errorResponseObj);
        }

        const newRentalObj = await models.sequelize.transaction(async (t) => {
          enquiryObj.listing.listingStatus.statusType = 'rented';

          await enquiryObj.listing.listingStatus.save({ transaction: t });

          enquiryObj.enquiryStatus = 'accepted';

          await enquiryObj.save({ transaction: t });

          return models.ListingRental.create(
            {
              rentalStatus: 'pending',
              listingEnquiryId: enquiryObj.id,
            },
            {
              transaction: t,
            }
          );
        });

        const responseObj = {
          id: enquiryObj.id,
          status: enquiryObj.enquiryStatus,
          user: {
            id: enquiryObj.user.id,
            name: enquiryObj.user.name,
          },
          listing: {
            id: enquiryObj.listing.id,
            title: enquiryObj.listing.title,
          },
          rental: {
            id: newRentalObj.id,
            status: newRentalObj.rentalStatus,
          },
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
   * Reject (POST) a listing enquiry \
   * with params `enquiryId`.
   */
  async rejectListingEnquiryItem(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const enquiryObj = await models.ListingEnquiry.findByPk(
        req.validated.params.value.enquiryId,
        {
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
        }
      );

      if (enquiryObj) {
        if (enquiryObj.listing.userId !== req.user.id) {
          return this.unauthorized(res, null);
        }

        if (
          ['accepted', 'rejected', 'completed'].some(
            (status) => enquiryObj.enquiryStatus === status
          )
        ) {
          errorResponseObj = errorResponses.lockedEnquiryError;
          errorResponseObj.extra = { enquiryStatus: enquiryObj.enquiryStatus };

          return this.forbidden(res, errorResponseObj);
        }

        enquiryObj.enquiryStatus = 'rejected';

        await enquiryObj.save();

        const responseObj = {
          id: enquiryObj.id,
          status: enquiryObj.enquiryStatus,
          user: {
            id: enquiryObj.user.id,
            name: enquiryObj.user.name,
          },
          listing: {
            id: enquiryObj.listing.id,
            title: enquiryObj.listing.title,
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
   * Cancel (POST) a listing enquiry \
   * with params `enquiryId`.
   */
  async cancelListingEnquiryItem(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const enquiryObj = await models.ListingEnquiry.findByPk(
        req.validated.params.value.enquiryId,
        {
          include: [
            {
              model: models.User,
              as: 'user',
            },
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
            {
              model: models.ListingRental,
              as: 'listingRental',
            },
          ],
        }
      );

      if (enquiryObj) {
        if (
          ![enquiryObj.userId, enquiryObj.listing.userId].some(
            (userId) => req.user.id === userId
          )
        ) {
          return this.unauthorized(res, null);
        }

        if (
          ['pending', 'rejected', 'completed'].some(
            (status) => enquiryObj.enquiryStatus === status
          )
        ) {
          errorResponseObj = errorResponses.lockedEnquiryError;
          errorResponseObj.extra = { enquiryStatus: enquiryObj.enquiryStatus };

          return this.forbidden(res, errorResponseObj);
        }

        await models.sequelize.transaction(async (t) => {
          // Unnecessary if?
          if (enquiryObj.listingRental) {
            enquiryObj.listingRental.rentalStatus = 'cancelled';
            enquiryObj.listingRental.cancelledAt = models.sequelize.literal(
              'CURRENT_TIMESTAMP'
            );

            await enquiryObj.listingRental.save({ transaction: t });
          }

          enquiryObj.listing.listingStatus.statusType = 'available';

          await enquiryObj.listing.listingStatus.save({ transaction: t });

          enquiryObj.enquiryStatus = 'completed';

          await enquiryObj.save({ transaction: t });
        });

        const responseObj = {
          id: enquiryObj.id,
          status: enquiryObj.enquiryStatus,
          user: {
            id: enquiryObj.user.id,
            name: enquiryObj.user.name,
          },
          listing: {
            id: enquiryObj.listing.id,
            title: enquiryObj.listing.title,
          },
          rental: {
            id: enquiryObj.listingRental.id,
            status: enquiryObj.listingRental.rentalStatus,
          },
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
}

module.exports = new EnquiryController();
