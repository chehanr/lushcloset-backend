const BaseController = require('./base');
const models = require('../models');
const { errorResponses } = require('../constants/errors');

class PurchaseController extends BaseController {
  /**
   * Retrieve a listing purchase \
   * with params `purchaseId`.
   */
  async retrieveListingPurchaseItem(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const purchaseObj = await models.ListingPurchase.findByPk(
        req.validated.params.value.purchaseId,
        {
          include: [
            {
              model: models.Listing,
              as: 'listing',
            },
            {
              model: models.User,
              as: 'user',
            },
          ],
        }
      );

      if (purchaseObj) {
        if (
          ![purchaseObj.listing.userId, purchaseObj.userId].some(
            (userId) => req.user.id === userId
          )
        ) {
          return this.unauthorized(res, null);
        }

        const responseObj = {
          id: purchaseObj.id,
          status: purchaseObj.purchaseStatus,
          listing: {
            id: purchaseObj.listing.id,
            title: purchaseObj.listing.title,
          },
          verification: {
            pickupCode: purchaseObj.pickVerifyCode,
          },
          purchaser: {
            id: purchaseObj.user.id,
            name: purchaseObj.user.name,
          },
          pickedAt: purchaseObj?.pickedAt || null,
          cancelledAt: purchaseObj?.cancelledAt || null,
          createdAt: purchaseObj.createdAt,
          updatedAt: purchaseObj.updatedAt,
        };

        if (req.user.id !== purchaseObj.userId) {
          responseObj.verification.pickupCode = null;
        }

        return this.ok(res, responseObj);
      }

      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }

  /**
   * Verify pickup (POST) a listing purchase \
   * with params `purchaseId`.
   * TODO: Add stripe stuff here?
   * TODO: Fix response returning object for a dt;
   */
  async verifyPickupListingPurchaseItem(req, res) {
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
      const purchaseObj = await models.ListingPurchase.findByPk(
        req.validated.params.value.purchaseId,
        {
          include: [
            {
              model: models.Listing,
              as: 'listing',
            },
            {
              model: models.User,
              as: 'user',
            },
          ],
        }
      );

      if (purchaseObj) {
        // Only the listing creator can verify.
        if (req.user.id !== purchaseObj.listing.userId) {
          return this.unauthorized(res, null);
        }

        // Only pending purchases can be picked.
        if (purchaseObj.purchaseStatus !== 'pending') {
          errorResponseObj = errorResponses.lockedPurchaseError;
          errorResponseObj.extra = {
            purchaseStatus: purchaseObj.purchaseStatus,
          };

          return this.forbidden(res, errorResponseObj);
        }

        if (purchaseObj.pickVerifyCode !== req.validated.body.value.code) {
          return this.forbidden(
            res,
            errorResponses.invalidPurchaseVerificationCodeError
          );
        }

        // Set purchase status.
        purchaseObj.purchaseStatus = 'picked';
        purchaseObj.pickedAt = models.sequelize.literal('CURRENT_TIMESTAMP');

        await purchaseObj.save();

        const responseObj = {
          id: purchaseObj.id,
          status: purchaseObj.purchaseStatus,
          listing: {
            id: purchaseObj.listing.id,
            title: purchaseObj.listing.title,
          },
          verification: {
            pickupCode: purchaseObj.pickVerifyCode,
          },
          purchaser: {
            id: purchaseObj.user.id,
            name: purchaseObj.user.name,
          },
          pickedAt: purchaseObj?.pickedAt || null,
          cancelledAt: purchaseObj?.cancelledAt || null,
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
   * Cancel (POST) a listing purchase \
   * with params `purchaseId`.
   */
  async cancelListingPurchaseItem(req, res) {
    let errorResponseObj;

    if (req.validated.params?.error) {
      errorResponseObj = errorResponses.validationParamError;
      errorResponseObj.extra = req.validated.params.error;

      return this.unprocessableEntity(res, errorResponseObj);
    }

    try {
      const purchaseObj = await models.ListingPurchase.findByPk(
        req.validated.params.value.purchaseId,
        {
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
            {
              model: models.User,
              as: 'user',
            },
          ],
        }
      );

      if (purchaseObj) {
        if (
          ![purchaseObj.userId, purchaseObj.listing.userId].some(
            (userId) => req.user.id === userId
          )
        ) {
          return this.unauthorized(res, null);
        }

        if (
          ['picked', 'cancelled'].some(
            (status) => purchaseObj.purchaseStatus === status
          )
        ) {
          errorResponseObj = errorResponses.lockedPurchaseError;
          errorResponseObj.extra = {
            purchaseStatus: purchaseObj.purchaseStatus,
          };

          return this.forbidden(res, errorResponseObj);
        }

        await models.sequelize.transaction(async (t) => {
          purchaseObj.purchaseStatus = 'cancelled';
          purchaseObj.cancelledAt = models.sequelize.literal(
            'CURRENT_TIMESTAMP'
          );

          await purchaseObj.save({ transaction: t });

          purchaseObj.listing.listingStatus.statusType = 'available';

          await purchaseObj.listing.listingStatus.save({ transaction: t });
        });

        const responseObj = {
          id: purchaseObj.id,
          status: purchaseObj.purchaseStatus,
          listing: {
            id: purchaseObj.listing.id,
            title: purchaseObj.listing.title,
          },
          verification: {
            pickupCode: purchaseObj.pickVerifyCode,
          },
          purchaser: {
            id: purchaseObj.user.id,
            name: purchaseObj.user.name,
          },
          pickedAt: purchaseObj?.pickedAt || null,
          cancelledAt: purchaseObj?.cancelledAt || null,
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
}

module.exports = new PurchaseController();
