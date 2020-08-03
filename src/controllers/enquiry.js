const BaseController = require('./base');
const models = require('../models');

class EnquiryController extends BaseController {
  /**
   * Retrieve a listing enquiry \
   * with params `enquiryId`.
   */
  async retrieveListingEnquiryItem(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.params?.error) {
      errorResponseObj.validation.params = req.validated.params.error;

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
        if (
          !(
            enquiryObj.userId === req.user.id ||
            enquiryObj.listing.userId === req.user.id
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
   * Update a listing enquiry \
   * with params `enquiryId`.
   */
  async updateListingEnquiryItem(req, res) {
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
        if (enquiryObj.userId !== req.user.id) {
          return this.unauthorized(res, null);
        }

        if (enquiryObj.enquiryStatus !== 'pending') {
          return this.forbidden(
            res,
            `The listing enquiry is locked (status: ${enquiryObj.enquiryStatus})`
          );
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
   * Delete a listing enquiry \
   * with params `enquiryId`.
   */
  async deleteListingEnquiryItem(req, res) {
    const errorResponseObj = { validation: {} };

    if (req.validated.params?.error) {
      errorResponseObj.validation.params = req.validated.params.error;

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
          enquiryObj.enquiryStatus === 'accepted' ||
          enquiryObj.enquiryStatus === 'rejected'
        ) {
          return this.forbidden(
            res,
            `The listing enquiry is locked (status: ${enquiryObj.enquiryStatus})`
          );
        }

        await enquiryObj.destroy();

        return this.noContent(res, null);
      }

      return this.notFound(res, null);
    } catch (error) {
      return this.fail(res, error);
    }
  }
}

module.exports = new EnquiryController();
